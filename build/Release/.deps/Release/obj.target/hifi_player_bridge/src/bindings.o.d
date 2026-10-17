cmd_Release/obj.target/hifi_player_bridge/src/bindings.o := aarch64-linux-android-clang++ -o Release/obj.target/hifi_player_bridge/src/bindings.o ../src/bindings.cpp '-DNODE_GYP_MODULE_NAME=hifi_player_bridge' '-DUSING_UV_SHARED=1' '-DUSING_V8_SHARED=1' '-DV8_DEPRECATION_WARNINGS=1' '-D_GLIBCXX_USE_CXX11_ABI=1' '-D_FILE_OFFSET_BITS=64' '-D_LARGEFILE_SOURCE' '-D__STDC_FORMAT_MACROS' '-DBUILDING_NODE_EXTENSION' '-D_GLIBCXX_USE_C99_MATH' -I/data/data/com.termux/files/usr/include/node -I/data/data/com.termux/files/usr/src -I/data/data/com.termux/files/usr/deps/openssl/config -I/data/data/com.termux/files/usr/deps/openssl/openssl/include -I/data/data/com.termux/files/usr/deps/uv/include -I/data/data/com.termux/files/usr/deps/zlib -I/data/data/com.termux/files/usr/deps/v8/include  -fPIC -Wall -Wextra -Wno-unused-parameter -O3 -fno-omit-frame-pointer -fno-rtti -fno-exceptions -fno-strict-aliasing -std=gnu++20 -MMD -MF ./Release/.deps/Release/obj.target/hifi_player_bridge/src/bindings.o.d.raw   -c
Release/obj.target/hifi_player_bridge/src/bindings.o: ../src/bindings.cpp \
  /data/data/com.termux/files/usr/include/node/node.h \
  /data/data/com.termux/files/usr/include/node/v8.h \
  /data/data/com.termux/files/usr/include/node/cppgc/common.h \
  /data/data/com.termux/files/usr/include/node/v8config.h \
  /data/data/com.termux/files/usr/include/node/v8-array-buffer.h \
  /data/data/com.termux/files/usr/include/node/v8-local-handle.h \
  /data/data/com.termux/files/usr/include/node/v8-handle-base.h \
  /data/data/com.termux/files/usr/include/node/v8-internal.h \
  /data/data/com.termux/files/usr/include/node/v8-memory-span.h \
  /data/data/com.termux/files/usr/include/node/v8-object.h \
  /data/data/com.termux/files/usr/include/node/v8-maybe.h \
  /data/data/com.termux/files/usr/include/node/cppgc/internal/conditional-stack-allocated.h \
  /data/data/com.termux/files/usr/include/node/cppgc/macros.h \
  /data/data/com.termux/files/usr/include/node/cppgc/internal/compiler-specific.h \
  /data/data/com.termux/files/usr/include/node/cppgc/type-traits.h \
  /data/data/com.termux/files/usr/include/node/v8-persistent-handle.h \
  /data/data/com.termux/files/usr/include/node/v8-weak-callback-info.h \
  /data/data/com.termux/files/usr/include/node/v8-primitive.h \
  /data/data/com.termux/files/usr/include/node/v8-data.h \
  /data/data/com.termux/files/usr/include/node/v8-value.h \
  /data/data/com.termux/files/usr/include/node/v8-sandbox.h \
  /data/data/com.termux/files/usr/include/node/v8-traced-handle.h \
  /data/data/com.termux/files/usr/include/node/v8-platform.h \
  /data/data/com.termux/files/usr/include/node/v8-source-location.h \
  /data/data/com.termux/files/usr/include/node/v8-container.h \
  /data/data/com.termux/files/usr/include/node/v8-context.h \
  /data/data/com.termux/files/usr/include/node/v8-snapshot.h \
  /data/data/com.termux/files/usr/include/node/v8-isolate.h \
  /data/data/com.termux/files/usr/include/node/v8-callbacks.h \
  /data/data/com.termux/files/usr/include/node/v8-promise.h \
  /data/data/com.termux/files/usr/include/node/v8-debug.h \
  /data/data/com.termux/files/usr/include/node/v8-script.h \
  /data/data/com.termux/files/usr/include/node/v8-message.h \
  /data/data/com.termux/files/usr/include/node/v8-embedder-heap.h \
  /data/data/com.termux/files/usr/include/node/v8-exception.h \
  /data/data/com.termux/files/usr/include/node/v8-function-callback.h \
  /data/data/com.termux/files/usr/include/node/v8-microtask.h \
  /data/data/com.termux/files/usr/include/node/v8-statistics.h \
  /data/data/com.termux/files/usr/include/node/v8-unwinder.h \
  /data/data/com.termux/files/usr/include/node/v8-embedder-state-scope.h \
  /data/data/com.termux/files/usr/include/node/v8-date.h \
  /data/data/com.termux/files/usr/include/node/v8-extension.h \
  /data/data/com.termux/files/usr/include/node/v8-external.h \
  /data/data/com.termux/files/usr/include/node/v8-function.h \
  /data/data/com.termux/files/usr/include/node/v8-template.h \
  /data/data/com.termux/files/usr/include/node/v8-initialization.h \
  /data/data/com.termux/files/usr/include/node/v8-json.h \
  /data/data/com.termux/files/usr/include/node/v8-locker.h \
  /data/data/com.termux/files/usr/include/node/v8-microtask-queue.h \
  /data/data/com.termux/files/usr/include/node/v8-primitive-object.h \
  /data/data/com.termux/files/usr/include/node/v8-proxy.h \
  /data/data/com.termux/files/usr/include/node/v8-regexp.h \
  /data/data/com.termux/files/usr/include/node/v8-typed-array.h \
  /data/data/com.termux/files/usr/include/node/v8-value-serializer.h \
  /data/data/com.termux/files/usr/include/node/v8-version.h \
  /data/data/com.termux/files/usr/include/node/v8-wasm.h \
  /data/data/com.termux/files/usr/include/node/node_version.h \
  /data/data/com.termux/files/usr/include/node/node_api.h \
  /data/data/com.termux/files/usr/include/node/js_native_api.h \
  /data/data/com.termux/files/usr/include/node/js_native_api_types.h \
  /data/data/com.termux/files/usr/include/node/node_api_types.h
../src/bindings.cpp:
/data/data/com.termux/files/usr/include/node/node.h:
/data/data/com.termux/files/usr/include/node/v8.h:
/data/data/com.termux/files/usr/include/node/cppgc/common.h:
/data/data/com.termux/files/usr/include/node/v8config.h:
/data/data/com.termux/files/usr/include/node/v8-array-buffer.h:
/data/data/com.termux/files/usr/include/node/v8-local-handle.h:
/data/data/com.termux/files/usr/include/node/v8-handle-base.h:
/data/data/com.termux/files/usr/include/node/v8-internal.h:
/data/data/com.termux/files/usr/include/node/v8-memory-span.h:
/data/data/com.termux/files/usr/include/node/v8-object.h:
/data/data/com.termux/files/usr/include/node/v8-maybe.h:
/data/data/com.termux/files/usr/include/node/cppgc/internal/conditional-stack-allocated.h:
/data/data/com.termux/files/usr/include/node/cppgc/macros.h:
/data/data/com.termux/files/usr/include/node/cppgc/internal/compiler-specific.h:
/data/data/com.termux/files/usr/include/node/cppgc/type-traits.h:
/data/data/com.termux/files/usr/include/node/v8-persistent-handle.h:
/data/data/com.termux/files/usr/include/node/v8-weak-callback-info.h:
/data/data/com.termux/files/usr/include/node/v8-primitive.h:
/data/data/com.termux/files/usr/include/node/v8-data.h:
/data/data/com.termux/files/usr/include/node/v8-value.h:
/data/data/com.termux/files/usr/include/node/v8-sandbox.h:
/data/data/com.termux/files/usr/include/node/v8-traced-handle.h:
/data/data/com.termux/files/usr/include/node/v8-platform.h:
/data/data/com.termux/files/usr/include/node/v8-source-location.h:
/data/data/com.termux/files/usr/include/node/v8-container.h:
/data/data/com.termux/files/usr/include/node/v8-context.h:
/data/data/com.termux/files/usr/include/node/v8-snapshot.h:
/data/data/com.termux/files/usr/include/node/v8-isolate.h:
/data/data/com.termux/files/usr/include/node/v8-callbacks.h:
/data/data/com.termux/files/usr/include/node/v8-promise.h:
/data/data/com.termux/files/usr/include/node/v8-debug.h:
/data/data/com.termux/files/usr/include/node/v8-script.h:
/data/data/com.termux/files/usr/include/node/v8-message.h:
/data/data/com.termux/files/usr/include/node/v8-embedder-heap.h:
/data/data/com.termux/files/usr/include/node/v8-exception.h:
/data/data/com.termux/files/usr/include/node/v8-function-callback.h:
/data/data/com.termux/files/usr/include/node/v8-microtask.h:
/data/data/com.termux/files/usr/include/node/v8-statistics.h:
/data/data/com.termux/files/usr/include/node/v8-unwinder.h:
/data/data/com.termux/files/usr/include/node/v8-embedder-state-scope.h:
/data/data/com.termux/files/usr/include/node/v8-date.h:
/data/data/com.termux/files/usr/include/node/v8-extension.h:
/data/data/com.termux/files/usr/include/node/v8-external.h:
/data/data/com.termux/files/usr/include/node/v8-function.h:
/data/data/com.termux/files/usr/include/node/v8-template.h:
/data/data/com.termux/files/usr/include/node/v8-initialization.h:
/data/data/com.termux/files/usr/include/node/v8-json.h:
/data/data/com.termux/files/usr/include/node/v8-locker.h:
/data/data/com.termux/files/usr/include/node/v8-microtask-queue.h:
/data/data/com.termux/files/usr/include/node/v8-primitive-object.h:
/data/data/com.termux/files/usr/include/node/v8-proxy.h:
/data/data/com.termux/files/usr/include/node/v8-regexp.h:
/data/data/com.termux/files/usr/include/node/v8-typed-array.h:
/data/data/com.termux/files/usr/include/node/v8-value-serializer.h:
/data/data/com.termux/files/usr/include/node/v8-version.h:
/data/data/com.termux/files/usr/include/node/v8-wasm.h:
/data/data/com.termux/files/usr/include/node/node_version.h:
/data/data/com.termux/files/usr/include/node/node_api.h:
/data/data/com.termux/files/usr/include/node/js_native_api.h:
/data/data/com.termux/files/usr/include/node/js_native_api_types.h:
/data/data/com.termux/files/usr/include/node/node_api_types.h:
