package com.academia.gymacademy.controller;

import com.academia.gymacademy.dto.response.ApiResponse;
import com.academia.gymacademy.dto.response.DashboardResponse;
import com.academia.gymacademy.service.AcessoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@PreAuthorize("hasAnyRole('ADMIN','RECEPCIONISTA')")
public class DashboardController {

    @Autowired private AcessoService acessoService;

    /** GET /api/dashboard */
    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> dashboard() {
        return ResponseEntity.ok(
                ApiResponse.ok("Dashboard carregado.", acessoService.gerarDashboard()));
    }
}
