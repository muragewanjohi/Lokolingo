package com.lokolingo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lokolingo.domain.enumeration.AgeGrouping;
import com.lokolingo.domain.enumeration.Language;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Subject.
 */
@Entity
@Table(name = "subject")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Subject implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "age")
    private AgeGrouping age;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false)
    private Language language;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @OneToMany(mappedBy = "subject")
    @JsonIgnoreProperties(value = { "tiles", "subject" }, allowSetters = true)
    private Set<Lesson> lessons = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "subjects", "child" }, allowSetters = true)
    private Learning learning;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Subject id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AgeGrouping getAge() {
        return this.age;
    }

    public Subject age(AgeGrouping age) {
        this.setAge(age);
        return this;
    }

    public void setAge(AgeGrouping age) {
        this.age = age;
    }

    public Language getLanguage() {
        return this.language;
    }

    public Subject language(Language language) {
        this.setLanguage(language);
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public String getTitle() {
        return this.title;
    }

    public Subject title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Set<Lesson> getLessons() {
        return this.lessons;
    }

    public void setLessons(Set<Lesson> lessons) {
        if (this.lessons != null) {
            this.lessons.forEach(i -> i.setSubject(null));
        }
        if (lessons != null) {
            lessons.forEach(i -> i.setSubject(this));
        }
        this.lessons = lessons;
    }

    public Subject lessons(Set<Lesson> lessons) {
        this.setLessons(lessons);
        return this;
    }

    public Subject addLesson(Lesson lesson) {
        this.lessons.add(lesson);
        lesson.setSubject(this);
        return this;
    }

    public Subject removeLesson(Lesson lesson) {
        this.lessons.remove(lesson);
        lesson.setSubject(null);
        return this;
    }

    public Learning getLearning() {
        return this.learning;
    }

    public void setLearning(Learning learning) {
        this.learning = learning;
    }

    public Subject learning(Learning learning) {
        this.setLearning(learning);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Subject)) {
            return false;
        }
        return id != null && id.equals(((Subject) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Subject{" +
            "id=" + getId() +
            ", age='" + getAge() + "'" +
            ", language='" + getLanguage() + "'" +
            ", title='" + getTitle() + "'" +
            "}";
    }
}
