package com.nisanth.billingsoftware.service;

import com.nisanth.billingsoftware.io.CategoryRequest;
import com.nisanth.billingsoftware.io.CategoryResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CategoryService {

   CategoryResponse add(CategoryRequest request, MultipartFile file);
   List<CategoryResponse> read();

   void delete(String categoryId);
}
