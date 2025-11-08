package com.nisanth.billingsoftware.controller;

import com.nisanth.billingsoftware.service.impl.StockPredictionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/predictions")
@CrossOrigin(origins = "*")
public class StockPredictionController {

    @Autowired
    private StockPredictionService stockPredictionService;

    @GetMapping
    public List<Map<String, Object>> getStockPredictions() {
        return stockPredictionService.getAllPredictions();
    }
}
