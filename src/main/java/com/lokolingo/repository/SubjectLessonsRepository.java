package com.lokolingo.repository;

import com.lokolingo.domain.SubjectLessons;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the SubjectLessons entity.
 */
@SuppressWarnings("unused")
@Repository
public interface SubjectLessonsRepository extends JpaRepository<SubjectLessons, Long> {}
