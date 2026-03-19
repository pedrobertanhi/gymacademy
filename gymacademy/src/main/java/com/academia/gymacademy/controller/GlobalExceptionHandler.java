package com.academia.gymacademy.controller;

import com.academia.gymacademy.dto.RespostaApi;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.util.stream.Collectors;

/**
 * Captura exceções lançadas em qualquer Controller/Service
 * e retorna respostas JSON padronizadas para o Front-end.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Trata erros de validação de campos (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RespostaApi> tratarValidacao(MethodArgumentNotValidException ex) {
        String mensagens = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(erro -> erro.getField() + ": " + erro.getDefaultMessage())
                .collect(Collectors.joining(" | "));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new RespostaApi(false, mensagens));
    }

    // Trata erros lançados com ResponseStatusException (404, 401, 403, 409...)
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<RespostaApi> tratarResponseStatus(ResponseStatusException ex) {
        return ResponseEntity
                .status(ex.getStatusCode())
                .body(new RespostaApi(false, ex.getReason()));
    }

    // Trata qualquer outro erro inesperado
    @ExceptionHandler(Exception.class)
    public ResponseEntity<RespostaApi> tratarErroGenerico(Exception ex) {
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new RespostaApi(false, "Erro interno no servidor: " + ex.getMessage()));
    }
}
