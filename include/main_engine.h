#ifndef MAIN_ENGINE_H
#define MAIN_ENGINE_H

#include <string>

// Initialize hardware abstractions 
void initialize_jamin_grahms();

// Parse properties of high-quality local media files
void parse_audio_file(const std::string& file_path);

#endif // MAIN_ENGINE_H

