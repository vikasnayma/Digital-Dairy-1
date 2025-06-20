package com.DigitalDairy.DigitalDairy.Services;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PaypalService {

    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getAccessToken() {
        String url = "https://api-m.sandbox.paypal.com/v1/oauth2/token";
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(clientId, clientSecret);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<String> request = new HttpEntity<>("grant_type=client_credentials", headers);
        ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, request, Map.class);

        return response.getBody().get("access_token").toString();
    }

    public String createOrder(Double amount, String currency) {
        String url = "https://api-m.sandbox.paypal.com/v2/checkout/orders";
        String accessToken = getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> orderData = new HashMap<>();
        orderData.put("intent", "CAPTURE");

        Map<String, Object> amountMap = new HashMap<>();
        amountMap.put("currency_code", currency);
        amountMap.put("value", String.format("%.2f", amount));

        Map<String, Object> purchaseUnit = new HashMap<>();
        purchaseUnit.put("amount", amountMap);

        orderData.put("purchase_units", List.of(purchaseUnit));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(orderData, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        return response.getBody().get("id").toString(); // returns EC-XXX order ID
    }

    public boolean captureOrder(String orderId) {
        String url = "https://api-m.sandbox.paypal.com/v2/checkout/orders/" + orderId + "/capture";
        String accessToken = getAccessToken();

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> request = new HttpEntity<>(headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        // Safe extraction
        List<Map<String, Object>> purchaseUnits = (List<Map<String, Object>>) response.getBody().get("purchase_units");
        if (purchaseUnits == null || purchaseUnits.isEmpty()) return false;

        Map<String, Object> payments = (Map<String, Object>) purchaseUnits.get(0).get("payments");
        if (payments == null) return false;

        List<Map<String, Object>> captures = (List<Map<String, Object>>) payments.get("captures");
        if (captures == null || captures.isEmpty()) return false;

        String status = (String) captures.get(0).get("status");
        return "COMPLETED".equalsIgnoreCase(status);
    }

}



//import com.paypal.api.payments.*;
//import com.paypal.base.rest.APIContext;
//import com.paypal.base.rest.PayPalRESTException;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class PaypalService {
//
//    @Autowired
//    private APIContext apiContext;
//
//    public Payment createPayment(
//            Double total,
//            String currency,
//            String method,
//            String intent,
//            String description,
//            String cancelUrl,
//            String successUrl) throws PayPalRESTException {
//
//        Amount amount = new Amount();
//        amount.setCurrency(currency);
//        amount.setTotal(String.format("%.2f", total));
//
//        Transaction transaction = new Transaction();
//        transaction.setDescription(description);
//        transaction.setAmount(amount);
//
//        List<Transaction> transactions = new ArrayList<>();
//        transactions.add(transaction);
//
//        Payer payer = new Payer();
//        payer.setPaymentMethod(method);
//
//        Payment payment = new Payment();
//        payment.setIntent(intent);
//        payment.setPayer(payer);
//        payment.setTransactions(transactions);
//
//        RedirectUrls redirectUrls = new RedirectUrls();
//        redirectUrls.setCancelUrl(cancelUrl);
//        redirectUrls.setReturnUrl(successUrl);
//        payment.setRedirectUrls(redirectUrls);
//
//        return payment.create(apiContext);
//    }
//
//    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
//        Payment payment = new Payment();
//        payment.setId(paymentId);
//        PaymentExecution paymentExecute = new PaymentExecution();
//        paymentExecute.setPayerId(payerId);
//        return payment.execute(apiContext, paymentExecute);
//    }
//}
