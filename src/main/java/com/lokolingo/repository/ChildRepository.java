package com.lokolingo.repository;

import com.lokolingo.domain.Child;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Child entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ChildRepository extends JpaRepository<Child, Long> {
    List<Child> findAllByParentId(Long parentId);

    List<Child> findAllByParentUserLogin(String login);
}
