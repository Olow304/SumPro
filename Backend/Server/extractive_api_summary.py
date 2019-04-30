from __future__ import print_function
import array
import string
import operator

# Natural Language Processing Libraries
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from flask import Flask, render_template, request, jsonify, abort
from flask_cors import CORS
import os
import re, urllib
import pickle
import nltk
import numpy as np
import datetime
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup

stop = stopwords.words('english')
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer

NOUNS = ['NN', 'NNS', 'NNP', 'NNPS']


class extractive_summarizer:

    def clean_document(self, article):
        article = re.sub('[^A-Za-z .-]+', ' ', article)
        article = article.replace('-', '')
        article = article.replace('...', '')
        article = article.replace('Mr.', 'Mr').replace('Mrs.', 'Mrs')

        # Remove Ancronymns M.I.T. -> MIT
        # to help with sentence tokenizing
        article = self.merge_acronyms(article)

        # Remove extra whitespace
        article = ' '.join(article.split())
        return article

    def remove_stop_words(self, article):
        article = ' '.join([i for i in article.split() if i not in stop])
        return article

    def similarity_score(self, t, s):
        """
            Returns a similarity score for a given sentence.
            similarity score = the total number of tokens in a sentence that exits within the title / total words in title
        """
        t = self.remove_stop_words(t.lower())
        s = self.remove_stop_words(s.lower())
        t_tokens, s_tokens = t.split(), s.split()
        similar = [w for w in s_tokens if w in t_tokens]
        score = (len(similar) * 0.1) / len(t_tokens)
        return score

    def merge_acronyms(self, s):
        """
            Merges all acronyms in a given sentence. For example M.I.T -> MIT
        """
        r = re.compile(r'(?:(?<=\.|\s)[A-Z]\.)+')
        acronyms = r.findall(s)
        for a in acronyms:
            s = s.replace(a, a.replace('.', ''))
        return s

    def rank_sentences(self, doc, doc_matrix, feature_names, top_n):
        """
            Returns top_n sentences. Theses sentences are then used as summary
            of document.
            input
            ------------
            doc : a document as type str
            doc_matrix : a dense tf-idf matrix calculated with Scikits TfidfTransformer
            feature_names : a list of all features, the index is used to look up
                            tf-idf scores in the doc_matrix
            top_n : number of sentences to return
        """
        sents = nltk.sent_tokenize(doc)
        sentences = [nltk.word_tokenize(sent) for sent in sents]
        sentences = [[w for w in sent if nltk.pos_tag([w])[0][1] in NOUNS]
                     for sent in sentences]
        tfidf_sent = [[doc_matrix[feature_names.index(w.lower())]
                       for w in sent if w.lower() in feature_names]
                      for sent in sentences]

        # Calculate Sentence Values
        doc_val = sum(doc_matrix)
        sent_values = [sum(sent) / doc_val for sent in tfidf_sent]

        # Apply Similariy Score Weightings
        similarity_scores = [self.similarity_score(self.title, sent) for sent in sents]
        scored_sents = np.array(sent_values) + np.array(similarity_scores)

        # Apply Position Weights
        ranked_sents = [sent * (i / len(sent_values))
                        for i, sent in enumerate(sent_values)]

        ranked_sents = [pair for pair in zip(list(range(len(sent_values))), sent_values)]
        ranked_sents = sorted(ranked_sents, key=lambda x: x[1] * -1)

        return ranked_sents[:top_n]

    def generate_summary(self, document, title, n_sentence):
        self.document = document
        self.title = title
        self.n_sentence = n_sentence
        # model = PreprocessingNLTK()
        cleaned_document = self.clean_document(self.document)
        doc = self.remove_stop_words(cleaned_document)

        # Merge corpus data and new document data
        datas = [' '.join(self.document)]
        train_data = set(datas + [doc])

        # Fit and Transform the term frequencies into a vector
        count_vect = CountVectorizer()
        count_vect = count_vect.fit(train_data)
        freq_term_matrix = count_vect.transform(train_data)
        feature_names = count_vect.get_feature_names()

        # Fit and Transform the TfidfTransformer
        tfidf = TfidfTransformer(norm="l2")
        tfidf.fit(freq_term_matrix)

        # Get the dense tf-idf matrix for the document
        story_freq_term_matrix = count_vect.transform([doc])
        story_tfidf_matrix = tfidf.transform(story_freq_term_matrix)
        story_dense = story_tfidf_matrix.todense()
        doc_matrix = story_dense.tolist()[0]

        # Get Top Ranking Sentences and join them as a summary
        top_sents = self.rank_sentences(doc, doc_matrix, feature_names, n_sentence)
        summary = '.'.join([cleaned_document.split('.')[i]
                            for i in [pair[0] for pair in top_sents]])
        summary = ' '.join(summary.split())
        return summary


app = Flask(__name__)

CORS(app)
@app.route('/extractive', methods=['POST'])
def original_text_form():
    if request.method == 'POST':
        user_input = request.get_json(force=True)
        article = user_input.get('article')
        title = user_input.get('title')
        n_sentence = user_input.get('n_sentence')

        summary = extractive_summarizer()
        summary_article = summary.generate_summary(article, title, n_sentence)
        return jsonify(summary_article)
    else:
        return "You are using get method, please us post method"


if __name__ == "__main__":
    app.debug = True
    app.run()
