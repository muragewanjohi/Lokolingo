package com.lokolingo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Question.
 */
@Entity
@Table(name = "question")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Question implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "description", nullable = false)
    private String description;

    @Lob
    @Column(name = "audio", nullable = false)
    private byte[] audio;

    @NotNull
    @Column(name = "audio_content_type", nullable = false)
    private String audioContentType;

    @NotNull
    @Column(name = "audio_description", nullable = false)
    private String audioDescription;

    @OneToMany(mappedBy = "question")
    @JsonIgnoreProperties(value = { "question" }, allowSetters = true)
    private Set<MultipleChoice> multipleChoices = new HashSet<>();

    @JsonIgnoreProperties(value = { "question", "lesson" }, allowSetters = true)
    @OneToOne(mappedBy = "question")
    private Tile tile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Question id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public Question description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public byte[] getAudio() {
        return this.audio;
    }

    public Question audio(byte[] audio) {
        this.setAudio(audio);
        return this;
    }

    public void setAudio(byte[] audio) {
        this.audio = audio;
    }

    public String getAudioContentType() {
        return this.audioContentType;
    }

    public Question audioContentType(String audioContentType) {
        this.audioContentType = audioContentType;
        return this;
    }

    public void setAudioContentType(String audioContentType) {
        this.audioContentType = audioContentType;
    }

    public String getAudioDescription() {
        return this.audioDescription;
    }

    public Question audioDescription(String audioDescription) {
        this.setAudioDescription(audioDescription);
        return this;
    }

    public void setAudioDescription(String audioDescription) {
        this.audioDescription = audioDescription;
    }

    public Set<MultipleChoice> getMultipleChoices() {
        return this.multipleChoices;
    }

    public void setMultipleChoices(Set<MultipleChoice> multipleChoices) {
        if (this.multipleChoices != null) {
            this.multipleChoices.forEach(i -> i.setQuestion(null));
        }
        if (multipleChoices != null) {
            multipleChoices.forEach(i -> i.setQuestion(this));
        }
        this.multipleChoices = multipleChoices;
    }

    public Question multipleChoices(Set<MultipleChoice> multipleChoices) {
        this.setMultipleChoices(multipleChoices);
        return this;
    }

    public Question addMultipleChoice(MultipleChoice multipleChoice) {
        this.multipleChoices.add(multipleChoice);
        multipleChoice.setQuestion(this);
        return this;
    }

    public Question removeMultipleChoice(MultipleChoice multipleChoice) {
        this.multipleChoices.remove(multipleChoice);
        multipleChoice.setQuestion(null);
        return this;
    }

    public Tile getTile() {
        return this.tile;
    }

    public void setTile(Tile tile) {
        if (this.tile != null) {
            this.tile.setQuestion(null);
        }
        if (tile != null) {
            tile.setQuestion(this);
        }
        this.tile = tile;
    }

    public Question tile(Tile tile) {
        this.setTile(tile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Question)) {
            return false;
        }
        return id != null && id.equals(((Question) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Question{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", audio='" + getAudio() + "'" +
            ", audioContentType='" + getAudioContentType() + "'" +
            ", audioDescription='" + getAudioDescription() + "'" +
            "}";
    }
}
