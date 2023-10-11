package com.lokolingo.repository;

import com.lokolingo.domain.ChildLearnings;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the ChildLearnings entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChildLearningsRepository extends JpaRepository<ChildLearnings, Long> {}
