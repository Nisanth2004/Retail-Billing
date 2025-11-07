package com.nisanth.billingsoftware.service;

import com.nisanth.billingsoftware.io.RazorPayOrderResponse;
import com.razorpay.RazorpayException;

public interface RazorpayService {

    RazorPayOrderResponse createOrder(Double amount, String currency) throws RazorpayException;

}
