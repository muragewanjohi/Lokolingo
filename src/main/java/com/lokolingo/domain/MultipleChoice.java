package com.lokolingo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lokolingo.domain.enumeration.AnswerStatus;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A MultipleChoice.
 */
@Entity
@Table(name = "multiple_choice")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MultipleChoice implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private AnswerStatus status;

    @Lob
    @Column(name = "image", nullable = false)
    private byte[] image;

    @NotNull
    @Column(name = "image_content_type", nullable = false)
    private String imageContentType;

    @ManyToOne
    @JsonIgnoreProperties(value = { "multipleChoices" }, allowSetters = true)
    private Question question;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MultipleChoice id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AnswerStatus getStatus() {
        return this.status;
    }

    public MultipleChoice status(AnswerStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(AnswerStatus status) {
        this.status = status;
    }

    public byte[] getImage() {
        return this.image;
    }

    public MultipleChoice image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public MultipleChoice imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public Question getQuestion() {
        return this.question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public MultipleChoice question(Question question) {
        this.setQuestion(question);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MultipleChoice)) {
            return false;
        }
        return id != null && id.equals(((MultipleChoice) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MultipleChoice{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            "}";
    }
}
