#include "main_engine.h"
#include <iostream>

extern "C" {
#include <libavcodec/avcodec.h>
#include <libavformat/avformat.h>
#include <libavutil/avutil.h>
#include <libavutil/dict.h>
}
#include <SDL2/SDL.h>

void initialize_jamin_grahms() {
    std::cout << "\n===========================================" << std::endl;
    std::cout << "  jamin-grahms Core Engine Initializing... " << std::endl;
    std::cout << "===========================================" << std::endl;
    if (SDL_Init(SDL_INIT_AUDIO | SDL_INIT_VIDEO) < 0) {
        std::cerr << "[Core Error] Driver Initialization Failed: " << SDL_GetError() << std::endl;
    } else {
        std::cout << "[Core Success] Multimedia driver layers connected successfully." << std::endl;
    }
}

void parse_audio_file(const std::string& file_path) {
    AVFormatContext* format_context = nullptr;

    std::cout << "\n[Parser] Attempting to parse track file: " << file_path << std::endl;

    // 1. Open input media file stream container 
    if (avformat_open_input(&format_context, file_path.c_str(), nullptr, nullptr) < 0) {
        std::cerr << "[Parser Error] Could not open file structure down path: " << file_path << std::endl;
        return;
    }

    // 2. Read stream metadata data packets
    if (avformat_find_stream_info(format_context, nullptr) < 0) {
        std::cerr << "[Parser Error] Failed to read internal stream architecture parameters." << std::endl;
        avformat_close_input(&format_context);
        return;
    }

    // 3. Print container telemetry data details 
    std::cout << "[Parser Success] Format: " << format_context->iformat->long_name << std::endl;
    std::cout << "[Parser Success] Total Duration: " << (format_context->duration / AV_TIME_BASE) << " seconds." << std::endl;

    // 4. Extract track text-tag metadata values (Title, Artist, Album)
    AVDictionaryEntry* tag = nullptr;
    std::cout << "\n--- Track Metadata Info ---" << std::endl;
    while ((tag = av_dict_get(format_context->metadata, "", tag, AV_DICT_IGNORE_SUFFIX))) {
        std::cout << "  " << tag->key << ": " << tag->value << std::endl;
    }
    std::cout << "---------------------------" << std::endl;

    // Clean structural resources safely from memory
    avformat_close_input(&format_context);
    std::cout << "[Parser] Unloaded file allocations cleanly.\n" << std::endl;
}

