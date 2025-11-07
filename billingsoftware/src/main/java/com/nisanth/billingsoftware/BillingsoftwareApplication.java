package com.nisanth.billingsoftware;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.nisanth.billingsoftware.entity")
public class BillingsoftwareApplication {

	public static void main(String[] args) {
		SpringApplication.run(BillingsoftwareApplication.class, args);
	}

}
