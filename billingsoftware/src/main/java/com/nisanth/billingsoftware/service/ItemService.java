package com.nisanth.billingsoftware.service;

import com.nisanth.billingsoftware.io.ItemRequest;
import com.nisanth.billingsoftware.io.ItemResponse;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

public interface ItemService {
    public ItemResponse add(ItemRequest request, MultipartFile file);

   List<ItemResponse> fetchItems();
   void deleteItem(String itemId);



    // ✅ Deduct stock after sale (order placed)
    void updateStockAfterSale(String itemId, int soldQty);

    ItemResponse updateGstRates(String itemId, BigDecimal gstRate, BigDecimal cgstRate, BigDecimal sgstRate);
}
