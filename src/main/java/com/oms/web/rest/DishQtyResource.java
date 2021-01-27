package com.oms.web.rest;

import com.oms.domain.DishQty;
import com.oms.repository.DishQtyRepository;
import com.oms.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.oms.domain.DishQty}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DishQtyResource {

    private final Logger log = LoggerFactory.getLogger(DishQtyResource.class);

    private static final String ENTITY_NAME = "dishQty";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DishQtyRepository dishQtyRepository;

    public DishQtyResource(DishQtyRepository dishQtyRepository) {
        this.dishQtyRepository = dishQtyRepository;
    }

    /**
     * {@code POST  /dish-qties} : Create a new dishQty.
     *
     * @param dishQty the dishQty to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dishQty, or with status {@code 400 (Bad Request)} if the dishQty has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/dish-qties")
    public ResponseEntity<DishQty> createDishQty(@Valid @RequestBody DishQty dishQty) throws URISyntaxException {
        log.debug("REST request to save DishQty : {}", dishQty);
        if (dishQty.getId() != null) {
            throw new BadRequestAlertException("A new dishQty cannot already have an ID", ENTITY_NAME, "idexists");
        }
        DishQty result = dishQtyRepository.save(dishQty);
        return ResponseEntity.created(new URI("/api/dish-qties/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /dish-qties} : Updates an existing dishQty.
     *
     * @param dishQty the dishQty to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dishQty,
     * or with status {@code 400 (Bad Request)} if the dishQty is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dishQty couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/dish-qties")
    public ResponseEntity<DishQty> updateDishQty(@Valid @RequestBody DishQty dishQty) throws URISyntaxException {
        log.debug("REST request to update DishQty : {}", dishQty);
        if (dishQty.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        DishQty result = dishQtyRepository.save(dishQty);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, dishQty.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /dish-qties} : get all the dishQties.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of dishQties in body.
     */
    @GetMapping("/dish-qties")
    public List<DishQty> getAllDishQties() {
        log.debug("REST request to get all DishQties");
        return dishQtyRepository.findAll();
    }

    /**
     * {@code GET  /dish-qties/:id} : get the "id" dishQty.
     *
     * @param id the id of the dishQty to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dishQty, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/dish-qties/{id}")
    public ResponseEntity<DishQty> getDishQty(@PathVariable Long id) {
        log.debug("REST request to get DishQty : {}", id);
        Optional<DishQty> dishQty = dishQtyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dishQty);
    }

    /**
     * {@code DELETE  /dish-qties/:id} : delete the "id" dishQty.
     *
     * @param id the id of the dishQty to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/dish-qties/{id}")
    public ResponseEntity<Void> deleteDishQty(@PathVariable Long id) {
        log.debug("REST request to delete DishQty : {}", id);
        dishQtyRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
