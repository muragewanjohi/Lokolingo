package com.lokolingo.repository;

import com.lokolingo.domain.MultipleChoice;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the MultipleChoice entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MultipleChoiceRepository extends JpaRepository<MultipleChoice, Long> {}
