# CYBER//TUNE

A premium offline-first personal music player for music files owned by the user.

## Current build

Phase 1 foundation:
- Responsive Home / Library / Search shell
- Local music import entry point
- Local-only search over imported metadata
- Desktop sidebar + mobile bottom navigation
- Persistent mini-player shell
- Settings dialog and reduced-motion support
- No streaming services or remote music library

## Architecture roadmap

The next phases will separate the application into focused modules for the audio engine, IndexedDB persistence, metadata/artwork extraction, search indexing, playlists, favorites/history, queue management, and Now Playing.

## Important

The current foundation intentionally does not pretend to provide real playback or persistent storage yet. Those will be implemented and verified incrementally rather than shipped as fake controls.

## Run

This is currently a dependency-free static web application. Serve the repository root with any local static HTTP server and open `index.html`. Browser support for local audio formats depends on the browser/runtime.
