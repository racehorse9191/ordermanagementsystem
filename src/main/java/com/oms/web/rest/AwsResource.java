package com.oms.web.rest;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.amazonaws.services.s3.model.S3ObjectSummary;
import com.oms.repository.UserRepository;
import com.oms.service.MailService;
import com.oms.service.UserService;

@RestController
@RequestMapping("/aws")
public class AwsResource {
    private final UserService userService;

    public AwsResource(UserService userService) {
        this.userService = userService;
       
    }
    @GetMapping("/getawsdata")
    public List<S3ObjectSummary> getAwsdata() {
    return this.userService.awssthreelist();
    }
}
