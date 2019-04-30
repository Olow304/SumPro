package org.textsummary.extractive.domain;

public class Summary {
    private long id;
    private String articleTitle;
    private String articleAuthor;
    private String articleDate;
    private String articleSource;
    private String articleImage;
    private String articleRelate;
    private String articleLength;

    public Summary() { }

    public Summary(long id, String articleTitle, String articleAuthor, String articleDate, String articleSource, String articleImage, String articleRelate) {
        this.id = id;
        this.articleTitle = articleTitle;
        this.articleAuthor = articleAuthor;
        this.articleDate = articleDate;
        this.articleSource = articleSource;
        this.articleImage = articleImage;
        this.articleRelate = articleRelate;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getArticleTitle() {
        return articleTitle;
    }

    public void setArticleTitle(String articleTitle) {
        this.articleTitle = articleTitle;
    }

    public String getArticleAuthor() {
        return articleAuthor;
    }

    public void setArticleAuthor(String articleAuthor) {
        this.articleAuthor = articleAuthor;
    }

    public String getArticleDate() {
        return articleDate;
    }

    public void setArticleDate(String articleDate) {
        this.articleDate = articleDate;
    }

    public String getArticleSource() {
        return articleSource;
    }

    public void setArticleSource(String articleSource) {
        this.articleSource = articleSource;
    }

    public String getArticleImage() {
        return articleImage;
    }

    public void setArticleImage(String articleImage) {
        this.articleImage = articleImage;
    }

    public String getArticleRelate() {
        return articleRelate;
    }

    public void setArticleRelate(String articleRelate) {
        this.articleRelate = articleRelate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Summary)) return false;

        Summary summary = (Summary) o;

        return id == summary.id;
    }

    @Override
    public int hashCode() {
        return (int) (id ^ (id >>> 32));
    }

    @Override
    public String toString() {
        return "Summary{" +
                "id=" + id +
                ", articleTitle='" + articleTitle + '\'' +
                ", articleAuthor='" + articleAuthor + '\'' +
                ", articleDate='" + articleDate + '\'' +
                ", articleSource='" + articleSource + '\'' +
                ", articleImage='" + articleImage + '\'' +
                ", articleRelate='" + articleRelate + '\'' +
                '}';
    }
}
