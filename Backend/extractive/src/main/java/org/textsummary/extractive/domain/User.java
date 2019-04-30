package org.textsummary.extractive.domain;

import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class User {

    private String email;
    private String summary;
    private String link;
    private String title;
    private String image;

    public User() {
    }

    public User(String email, String summary, String link, String title, String image) {
        this.email = email;
        this.summary = summary;
        this.link = link;
        this.title = title;
        this.image = image;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;

        User user = (User) o;

        return email != null ? email.equals(user.email) : user.email == null;
    }

    @Override
    public int hashCode() {
        return email != null ? email.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "User{" +
                "email='" + email + '\'' +
                ", summary='" + summary + '\'' +
                ", link='" + link + '\'' +
                ", title='" + title + '\'' +
                ", image='" + image + '\'' +
                '}';
    }
}
