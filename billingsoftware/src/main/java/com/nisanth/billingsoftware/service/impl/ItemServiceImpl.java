package com.nisanth.billingsoftware.service.impl;

import com.nisanth.billingsoftware.entity.CategoryEntity;
import com.nisanth.billingsoftware.entity.ItemEntity;
import com.nisanth.billingsoftware.io.ItemRequest;
import com.nisanth.billingsoftware.io.ItemResponse;
import com.nisanth.billingsoftware.repository.CategoryRepository;
import com.nisanth.billingsoftware.repository.ItemRepository;
import com.nisanth.billingsoftware.service.FileUploadService;
import com.nisanth.billingsoftware.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final FileUploadService fileUploadService;

    @Override
    public ItemResponse add(ItemRequest request, MultipartFile file) {

        String imgUrl = fileUploadService.uploadFile(file);

        CategoryEntity category = categoryRepository.findByCategoryId(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));

        // GST Auto-Split Logic
        BigDecimal cgst = request.getCgstRate();
        BigDecimal sgst = request.getSgstRate();

        if (cgst == null || sgst == null) {
            BigDecimal gst = request.getGstRate() != null ? request.getGstRate() : BigDecimal.ZERO;
            BigDecimal half = gst.divide(BigDecimal.valueOf(2));
            cgst = half;
            sgst = half;
        }

        ItemEntity item = ItemEntity.builder()
                .itemId(UUID.randomUUID().toString())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .quantity(request.getQuantity() != null ? request.getQuantity() : 10)
                .category(category)
                .gstRate(request.getGstRate())        // keep old field
                .cgstRate(cgst)
                .sgstRate(sgst)
                .imgUrl(imgUrl)
                .build();

        item = itemRepository.save(item);
        return convertToResponse(item);
    }


    @Override
    public List<ItemResponse> fetchItems() {
        return itemRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteItem(String itemId) {
        ItemEntity existingItem = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        boolean deleted = fileUploadService.deletFile(existingItem.getImgUrl());
        if (deleted) {
            itemRepository.delete(existingItem);
        } else {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to delete the image");
        }
    }

    @Override
    public void updateStockAfterSale(String itemId, int soldQty) {
        ItemEntity item = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        if (item.getQuantity() < soldQty) {
            throw new RuntimeException("Insufficient stock for item: " + item.getName());
        }

        item.setQuantity(item.getQuantity() - soldQty);
        itemRepository.save(item);
    }



    // ✅ Add stock quantity manually (admin)
    public ItemResponse addStock(String itemId, int addedQuantity) {
        ItemEntity item = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));

        item.setQuantity(item.getQuantity() + addedQuantity);
        itemRepository.save(item);
        return convertToResponse(item);
    }
    public ItemResponse updateItemThreshold(String itemId, Integer minThreshold) {
        ItemEntity item = itemRepository.findByItemId(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setMinThreshold(minThreshold);
        ItemEntity updatedItem = itemRepository.save(item);

        // ✅ Return proper response object instead of entity
        return convertToResponse(updatedItem);
    }




    private ItemResponse convertToResponse(ItemEntity item) {
        return ItemResponse.builder()
                .itemId(item.getItemId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .imgUrl(item.getImgUrl())
                .categoryId(item.getCategory().getCategoryId())
                .categoryName(item.getCategory().getName())
                .minThreshold(item.getMinThreshold())
                .quantity(item.getQuantity())
                .gstRate(item.getGstRate())
                .cgstRate(item.getCgstRate())
                .sgstRate(item.getSgstRate())
                .createdAt(item.getCreatedAt())
                .updatedAt(item.getUpdatedAt())
                .build();
    }
}
