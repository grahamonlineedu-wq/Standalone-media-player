cmake_minimum_required(VERSION 3.15)
project(JaminGrahmsCore CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Hardcode Termux's absolute internal directory mappings
set(TERMUX_INCLUDE "/data/data/com.termux/files/usr/include")
set(TERMUX_LIB "/data/data/com.termux/files/usr/lib")

# Explicitly declare all required header tracking directories
include_directories(
    include
    ${TERMUX_INCLUDE}
)

link_directories(${TERMUX_LIB})

# Define the shared core engine object library
add_library(jamin_grahms_core SHARED 
    src/main_engine.cpp
)

# Connect system media libraries, explicitly adding avutil to fix the 75% block
target_link_libraries(jamin_grahms_core
    avformat
    avcodec
    avutil
    SDL2
)

# Add the test application launcher target
add_executable(jamin_grahms_app 
    ../platforms/desktop/main.cpp
)

# Link the test launcher executable to our core library engine
target_link_libraries(jamin_grahms_app jamin_grahms_core)

