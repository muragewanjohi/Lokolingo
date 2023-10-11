package com.lokolingo.config;

import java.time.Duration;
import org.ehcache.config.builders.*;
import org.ehcache.jsr107.Eh107Configuration;
import org.hibernate.cache.jcache.ConfigSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.cache.JCacheManagerCustomizer;
import org.springframework.boot.autoconfigure.orm.jpa.HibernatePropertiesCustomizer;
import org.springframework.boot.info.BuildProperties;
import org.springframework.boot.info.GitProperties;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.*;
import tech.jhipster.config.JHipsterProperties;
import tech.jhipster.config.cache.PrefixedKeyGenerator;

@Configuration
@EnableCaching
public class CacheConfiguration {

    private GitProperties gitProperties;
    private BuildProperties buildProperties;
    private final javax.cache.configuration.Configuration<Object, Object> jcacheConfiguration;

    public CacheConfiguration(JHipsterProperties jHipsterProperties) {
        JHipsterProperties.Cache.Ehcache ehcache = jHipsterProperties.getCache().getEhcache();

        jcacheConfiguration =
            Eh107Configuration.fromEhcacheCacheConfiguration(
                CacheConfigurationBuilder
                    .newCacheConfigurationBuilder(Object.class, Object.class, ResourcePoolsBuilder.heap(ehcache.getMaxEntries()))
                    .withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofSeconds(ehcache.getTimeToLiveSeconds())))
                    .build()
            );
    }

    @Bean
    public HibernatePropertiesCustomizer hibernatePropertiesCustomizer(javax.cache.CacheManager cacheManager) {
        return hibernateProperties -> hibernateProperties.put(ConfigSettings.CACHE_MANAGER, cacheManager);
    }

    @Bean
    public JCacheManagerCustomizer cacheManagerCustomizer() {
        return cm -> {
            createCache(cm, com.lokolingo.repository.UserRepository.USERS_BY_LOGIN_CACHE);
            createCache(cm, com.lokolingo.repository.UserRepository.USERS_BY_EMAIL_CACHE);
            createCache(cm, com.lokolingo.domain.User.class.getName());
            createCache(cm, com.lokolingo.domain.Authority.class.getName());
            createCache(cm, com.lokolingo.domain.User.class.getName() + ".authorities");
            createCache(cm, com.lokolingo.domain.Parent.class.getName());
            createCache(cm, com.lokolingo.domain.Parent.class.getName() + ".children");
            createCache(cm, com.lokolingo.domain.Child.class.getName());
            createCache(cm, com.lokolingo.domain.Subject.class.getName());
            createCache(cm, com.lokolingo.domain.SubjectLessons.class.getName());
            createCache(cm, com.lokolingo.domain.Lesson.class.getName());
            createCache(cm, com.lokolingo.domain.Learning.class.getName());
            createCache(cm, com.lokolingo.domain.ChildLearnings.class.getName());
            createCache(cm, com.lokolingo.domain.Tile.class.getName());
            createCache(cm, com.lokolingo.domain.LessonTiles.class.getName());
            createCache(cm, com.lokolingo.domain.Question.class.getName());
            createCache(cm, com.lokolingo.domain.Question.class.getName() + ".multipleChoices");
            createCache(cm, com.lokolingo.domain.MultipleChoice.class.getName());
            // jhipster-needle-ehcache-add-entry
        };
    }

    private void createCache(javax.cache.CacheManager cm, String cacheName) {
        javax.cache.Cache<Object, Object> cache = cm.getCache(cacheName);
        if (cache != null) {
            cache.clear();
        } else {
            cm.createCache(cacheName, jcacheConfiguration);
        }
    }

    @Autowired(required = false)
    public void setGitProperties(GitProperties gitProperties) {
        this.gitProperties = gitProperties;
    }

    @Autowired(required = false)
    public void setBuildProperties(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public KeyGenerator keyGenerator() {
        return new PrefixedKeyGenerator(this.gitProperties, this.buildProperties);
    }
}
