package com.lokolingo.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.lokolingo.domain.enumeration.Language;
import com.lokolingo.domain.enumeration.Level;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Lesson.
 */
@Entity
@Table(name = "lesson")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Lesson implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false)
    private Language language;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "level", nullable = false)
    private Level level;

    @OneToMany(mappedBy = "lesson")
    @JsonIgnoreProperties(value = { "question", "lesson" }, allowSetters = true)
    private Set<Tile> tiles = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "lessons", "learning" }, allowSetters = true)
    private Subject subject;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Lesson id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Lesson title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Language getLanguage() {
        return this.language;
    }

    public Lesson language(Language language) {
        this.setLanguage(language);
        return this;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public Level getLevel() {
        return this.level;
    }

    public Lesson level(Level level) {
        this.setLevel(level);
        return this;
    }

    public void setLevel(Level level) {
        this.level = level;
    }

    public Set<Tile> getTiles() {
        return this.tiles;
    }

    public void setTiles(Set<Tile> tiles) {
        if (this.tiles != null) {
            this.tiles.forEach(i -> i.setLesson(null));
        }
        if (tiles != null) {
            tiles.forEach(i -> i.setLesson(this));
        }
        this.tiles = tiles;
    }

    public Lesson tiles(Set<Tile> tiles) {
        this.setTiles(tiles);
        return this;
    }

    public Lesson addTile(Tile tile) {
        this.tiles.add(tile);
        tile.setLesson(this);
        return this;
    }

    public Lesson removeTile(Tile tile) {
        this.tiles.remove(tile);
        tile.setLesson(null);
        return this;
    }

    public Subject getSubject() {
        return this.subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public Lesson subject(Subject subject) {
        this.setSubject(subject);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Lesson)) {
            return false;
        }
        return id != null && id.equals(((Lesson) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Lesson{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", language='" + getLanguage() + "'" +
            ", level='" + getLevel() + "'" +
            "}";
    }
}
