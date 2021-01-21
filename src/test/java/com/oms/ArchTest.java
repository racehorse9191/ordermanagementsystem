package com.oms;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

class ArchTest {

    @Test
    void servicesAndRepositoriesShouldNotDependOnWebLayer() {

        JavaClasses importedClasses = new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("com.oms");

        noClasses()
            .that()
                .resideInAnyPackage("com.oms.service..")
            .or()
                .resideInAnyPackage("com.oms.repository..")
            .should().dependOnClassesThat()
                .resideInAnyPackage("..com.oms.web..")
        .because("Services and repositories should not depend on web layer")
        .check(importedClasses);
    }
}
