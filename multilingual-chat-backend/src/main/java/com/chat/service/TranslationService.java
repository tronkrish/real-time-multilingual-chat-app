package com.chat.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class TranslationService {

    private static final int MAX_CHUNK_CHARS = 150;

    private static final String GOOGLE_TRANSLATE_URL =
            "https://translate.googleapis.com/translate_a/single?client=gtx&sl={sl}&tl={tl}&dt=t&q={q}";

    // Google Input Tools Transliteration Endpoint
    private static final String TRANSLITERATION_URL =
            "https://inputtools.google.com/request?text={text}&itc={itc}&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8";

    private static final Map<String, String> LANGUAGE_CODE_MAP = new HashMap<>();

    static {
        // Indian Languages
        LANGUAGE_CODE_MAP.put("assamese", "as");
        LANGUAGE_CODE_MAP.put("bengali", "bn");
        LANGUAGE_CODE_MAP.put("gujarati", "gu");
        LANGUAGE_CODE_MAP.put("hindi", "hi");
        LANGUAGE_CODE_MAP.put("kannada", "kn");
        LANGUAGE_CODE_MAP.put("malayalam", "ml");
        LANGUAGE_CODE_MAP.put("marathi", "mr");
        LANGUAGE_CODE_MAP.put("nepali", "ne");
        LANGUAGE_CODE_MAP.put("odia", "or");
        LANGUAGE_CODE_MAP.put("punjabi", "pa");
        LANGUAGE_CODE_MAP.put("sanskrit", "sa");
        LANGUAGE_CODE_MAP.put("tamil", "ta");
        LANGUAGE_CODE_MAP.put("telugu", "te");
        LANGUAGE_CODE_MAP.put("urdu", "ur");

        // ... (Keep existing major ones to simplify for brevity, or add all)
        LANGUAGE_CODE_MAP.put("english", "en");
        LANGUAGE_CODE_MAP.put("french", "fr");
        LANGUAGE_CODE_MAP.put("spanish", "es");
        LANGUAGE_CODE_MAP.put("german", "de");
        LANGUAGE_CODE_MAP.put("arabic", "ar");
        LANGUAGE_CODE_MAP.put("chinese", "zh-CN");
        LANGUAGE_CODE_MAP.put("japanese", "ja");
    }

    private final RestTemplate restTemplate;

    public TranslationService() {
        this.restTemplate = new RestTemplate();
    }

    private String resolveLanguageCode(String language) {
        if (language == null || language.trim().isEmpty()) {
            return "en";
        }
        String lower = language.trim().toLowerCase();
        if (lower.length() <= 3 && lower.matches("[a-z]+")) {
            return lower;
        }
        if (lower.matches("[a-z]{2,3}(-[a-z]{2,4})?")) {
            return lower;
        }
        return LANGUAGE_CODE_MAP.getOrDefault(lower, "en");
    }

    /**
     * Checks if a string consists primarily of English/Latin alphabet characters.
     */
    private boolean isLatinScript(String text) {
        if (text == null || text.isEmpty()) return false;
        long latinCount = text.chars()
                .filter(c -> (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z'))
                .count();
        long totalAlpha = text.chars()
                .filter(Character::isLetter)
                .count();
        
        // If more than 50% of the letters are Latin, consider it Latin script
        return totalAlpha > 0 && ((double) latinCount / totalAlpha) > 0.5;
    }

    /**
     * Translates text. Handles Code-Mixing (Tanglish/Hinglish) via pre-transliteration.
     */
    public String translate(String text, String sourceLang, String targetLang) {
        if (text == null || text.trim().isEmpty()) {
            return text;
        }

        String sourceCode = resolveLanguageCode(sourceLang);
        String targetCode = resolveLanguageCode(targetLang);

        log.debug("Translation request: '{}' → '{}', text: {}", sourceCode, targetCode, text);

        try {
            String processedText = text;

            // STEP 1: TRANSLITERATION (Fix for Tanglish/Hinglish)
            // If the source language is an Indian language BUT the text is in English letters, 
            // the user is code-mixing (e.g. Tanglish). Transliterate it to native script first.
            if (isLatinScript(text) && !sourceCode.equals("en")) {
                processedText = transliterate(text, sourceCode);
                log.info("Transliterated (Tanglish/Hinglish) '{}' → '{}'", text, processedText);
            }

            // If same language, after transliteration, just return the native script
            if (sourceCode.equals(targetCode)) {
                return processedText;
            }

            // STEP 2: TRANSLATION
            // Now send it to Google Translate. We now use "auto" for source so Google handles nuances perfectly.
            return callGoogleTranslate(processedText, "auto", targetCode);

        } catch (Exception e) {
            log.warn("Translation failed [{}→{}]: {}", sourceCode, targetCode, e.getMessage());
            return text; // Return original on failure rather than fallback prefix
        }
    }

    /**
     * Transliterates Latin-script input to native script using Google Input Tools API.
     */
    @SuppressWarnings("unchecked")
    private String transliterate(String text, String langCode) {
        try {
            // Google Input Tools Language Code Format (e.g., "ta-t-i0-und")
            String itc = langCode + "-t-i0-und";

            // Transliterate word by word to preserve punctuation and structure
            String[] words = text.split("(?<=\\s)|(?=\\s)|(?<=[\\p{Punct}])|(?=[\\p{Punct}])");
            StringBuilder result = new StringBuilder();

            for (String word : words) {
                if (word.trim().isEmpty() || !word.matches(".*[a-zA-Z]+.*")) {
                    result.append(word);
                    continue;
                }

                Object rawResponse = restTemplate.getForObject(
                        TRANSLITERATION_URL,
                        Object.class,
                        word,
                        itc
                );

                // Parse Google Input Tools Response:
                // ["SUCCESS", [["word", ["transliteration1", ...], ...]]]
                boolean transliterated = false;
                if (rawResponse instanceof List) {
                    List<?> responseList = (List<?>) rawResponse;
                    if (responseList.size() > 1 && "SUCCESS".equals(responseList.get(0))) {
                        List<?> dataData = (List<?>) responseList.get(1);
                        if (!dataData.isEmpty() && dataData.get(0) instanceof List) {
                            List<?> wordData = (List<?>) dataData.get(0);
                            if (wordData.size() > 1 && wordData.get(1) instanceof List) {
                                List<?> options = (List<?>) wordData.get(1);
                                if (!options.isEmpty()) {
                                    result.append(options.get(0).toString());
                                    transliterated = true;
                                }
                            }
                        }
                    }
                }
                if (!transliterated) {
                    result.append(word); // fallback to original word
                }
            }
            return result.toString();
        } catch (Exception e) {
            log.error("Transliteration error for {}: {}", text, e.getMessage());
            return text; // If transliteration fails, return original and let auto-detect try its best
        }
    }

    @SuppressWarnings("unchecked")
    private String callGoogleTranslate(String text, String sourceCode, String targetCode) {
        Object rawResponse = restTemplate.getForObject(
                GOOGLE_TRANSLATE_URL, Object.class, sourceCode, targetCode, text);

        if (rawResponse instanceof List) {
            List<Object> response = (List<Object>) rawResponse;
            if (!response.isEmpty() && response.get(0) instanceof List) {
                List<Object> translations = (List<Object>) response.get(0);
                StringBuilder result = new StringBuilder();
                for (Object translation : translations) {
                    if (translation instanceof List) {
                        List<Object> parts = (List<Object>) translation;
                        if (!parts.isEmpty() && parts.get(0) != null) {
                            result.append(parts.get(0).toString());
                        }
                    }
                }
                String translatedText = result.toString();
                if (!translatedText.isEmpty()) {
                    return translatedText;
                }
            }
        }
        throw new RuntimeException("Unexpected translation response");
    }
}