# BookLLM AI Service

FastAPI 기반 AI 독서 감상평 분석 서비스

## Features

- 독서 감상평 AI 분석
- 감정 분석 및 공감 메시지 생성
- 도서 추천 서비스

## Setup

```bash
uv venv
source .venv/Scripts/activate
uv pip install -e .
```

## Run

```bash
uvicorn app.main:app --reload --port 8001
```