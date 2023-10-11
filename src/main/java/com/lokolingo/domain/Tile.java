package com.lokolingo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lokolingo.domain.enumeration.LockedStatus;
import java.io.Serializable;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Tile.
 */
@Entity
@Table(name = "tile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Tile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LockedStatus status;

    @Lob
    @Column(name = "image", nullable = false)
    private byte[] image;

    @NotNull
    @Column(name = "image_content_type", nullable = false)
    private String imageContentType;

    @Lob
    @Column(name = "audio", nullable = false)
    private byte[] audio;

    @NotNull
    @Column(name = "audio_content_type", nullable = false)
    private String audioContentType;

    @NotNull
    @Column(name = "language_title", nullable = false)
    private String languageTitle;

    @NotNull
    @Column(name = "english_title", nullable = false)
    private String englishTitle;

    @JsonIgnoreProperties(value = { "multipleChoices" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Question question;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Tile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LockedStatus getStatus() {
        return this.status;
    }

    public Tile status(LockedStatus status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(LockedStatus status) {
        this.status = status;
    }

    public byte[] getImage() {
        return this.image;
    }

    public Tile image(byte[] image) {
        this.setImage(image);
        return this;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getImageContentType() {
        return this.imageContentType;
    }

    public Tile imageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
        return this;
    }

    public void setImageContentType(String imageContentType) {
        this.imageContentType = imageContentType;
    }

    public byte[] getAudio() {
        return this.audio;
    }

    public Tile audio(byte[] audio) {
        this.setAudio(audio);
        return this;
    }

    public void setAudio(byte[] audio) {
        this.audio = audio;
    }

    public String getAudioContentType() {
        return this.audioContentType;
    }

    public Tile audioContentType(String audioContentType) {
        this.audioContentType = audioContentType;
        return this;
    }

    public void setAudioContentType(String audioContentType) {
        this.audioContentType = audioContentType;
    }

    public String getLanguageTitle() {
        return this.languageTitle;
    }

    public Tile languageTitle(String languageTitle) {
        this.setLanguageTitle(languageTitle);
        return this;
    }

    public void setLanguageTitle(String languageTitle) {
        this.languageTitle = languageTitle;
    }

    public String getEnglishTitle() {
        return this.englishTitle;
    }

    public Tile englishTitle(String englishTitle) {
        this.setEnglishTitle(englishTitle);
        return this;
    }

    public void setEnglishTitle(String englishTitle) {
        this.englishTitle = englishTitle;
    }

    public Question getQuestion() {
        return this.question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Tile question(Question question) {
        this.setQuestion(question);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tile)) {
            return false;
        }
        return id != null && id.equals(((Tile) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Tile{" +
            "id=" + getId() +
            ", status='" + getStatus() + "'" +
            ", image='" + getImage() + "'" +
            ", imageContentType='" + getImageContentType() + "'" +
            ", audio='" + getAudio() + "'" +
            ", audioContentType='" + getAudioContentType() + "'" +
            ", languageTitle='" + getLanguageTitle() + "'" +
            ", englishTitle='" + getEnglishTitle() + "'" +
            "}";
    }
}
