# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0]

## Added

- Docker Command
    - push
        - Push to registry (Github)
    - build
        - Build image and add labels from .ard-cli in project file.
- Rewrite import engine, now uses ArdCommand decorator!

## Updated

- Convert project to node 18