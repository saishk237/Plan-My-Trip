/**
 * AI Provider Integration
 * 
 * This module provides a unified interface for multiple AI providers:
 * - Google Gemini (gemini-1.5-flash)
 * - Groq (llama-3.1-8b-instant)
 * 
 * Features:
 * - Automatic provider selection based on availability
 * - Automatic failover if primary provider fails
 * - Environment-based configuration
 * 
 * Configuration:
 * - Set GEMINI_API_KEY for Google Gemini
 * - Set GROQ_API_KEY for Groq
 * - Set AI_PROVIDER to "gemini", "groq", or "auto" (default: auto)
 */

export { generateItinerary, getAIProviderInfo, type AIProvider } from "./ai-providers";
