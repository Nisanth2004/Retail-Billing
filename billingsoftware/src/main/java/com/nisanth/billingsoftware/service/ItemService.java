package com.nisanth.billingsoftware.service;

import com.nisanth.billingsoftware.io.ItemRequest;
import com.nisanth.billingsoftware.io.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ItemService {
    public ItemResponse add(ItemRequest request, MultipartFile file);

   List<ItemResponse> fetchItems();
   void deleteItem(String itemId);
}
