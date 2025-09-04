from typing import Dict, Any, List
import openai
import json
import os
from datetime import datetime

class OpenAIService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if self.api_key:
            openai.api_key = self.api_key
            self.client = openai.OpenAI(api_key=self.api_key)
        else:
            self.client = None
            
    def analyze_review(self, review_data: Dict[str, Any]) -> Dict[str, Any]:
        """책 리뷰를 분석하고 공감 메시지, 통찰, 감정 분석, 책 추천을 생성"""
        
        # Mock 응답 옵션 확인
        use_mock = os.getenv("USE_MOCK_RESPONSE", "true").lower() == "true"
        
        if use_mock or not self.client:
            return self._generate_mock_response(review_data)
        
        try:
            # GPT-4를 사용한 실제 분석
            prompt = f"""
            다음 독서 감상평을 분석하고 응답해주세요:
            
            책 제목: {review_data['book_title']}
            저자: {review_data['author']}
            장르: {review_data.get('genre', '일반')}
            평점: {review_data['rating']}/5
            독자의 감정: {review_data['user_emotion']}
            감상평: {review_data['content']}
            
            다음 형식의 JSON으로 응답해주세요:
            {{
                "empathy_message": "독자의 감정과 경험에 깊이 공감하는 따뜻하고 개인화된 메시지 (2-3문장)",
                "book_insights": [
                    "이 책의 핵심 주제나 메시지에 대한 통찰 1",
                    "작품의 문학적/예술적 가치에 대한 분석",
                    "이 책이 독자에게 미치는 영향이나 의미"
                ],
                "emotion_analysis": {{
                    "primary": "주요 감정",
                    "secondary": "보조 감정",
                    "intensity": "강도 (낮음/중간/높음)"
                }},
                "book_recommendations": [
                    {{
                        "title": "추천 도서 제목 1",
                        "author": "저자명",
                        "reason": "이 책을 추천하는 이유 (독자의 취향과 현재 책과의 연관성)"
                    }},
                    {{
                        "title": "추천 도서 제목 2", 
                        "author": "저자명",
                        "reason": "추천 이유"
                    }},
                    {{
                        "title": "추천 도서 제목 3",
                        "author": "저자명",
                        "reason": "추천 이유"
                    }}
                ],
                "personalized_insight": "이 독자만을 위한 특별한 통찰이나 조언 (1-2문장)"
            }}
            
            주의사항:
            1. 실제로 존재하는 책들을 추천하고, 해당 책들과 현재 책의 연관성을 명확히 설명하세요
            2. 독자의 감정 상태와 리뷰 내용을 깊이 이해하고 개인화된 응답을 제공하세요
            3. 책의 장르와 특성을 고려하여 적절한 추천을 하세요
            4. 한국어로 응답하세요
            """
            
            response = self.client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {
                        "role": "system",
                        "content": "당신은 깊이 있는 문학 비평가이자 따뜻한 독서 멘토입니다. 독자의 감정을 이해하고 책에 대한 통찰력 있는 분석을 제공하며, 개인화된 도서 추천을 합니다."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.8,
                max_tokens=1500
            )
            
            result = json.loads(response.choices[0].message.content)
            
            return {
                "ai_response": result,
                "analyzed_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"OpenAI API Error: {str(e)}")
            # API 오류 시 향상된 Mock 응답 제공
            return self._generate_enhanced_mock_response(review_data)
    
    def _generate_mock_response(self, review_data: Dict[str, Any]) -> Dict[str, Any]:
        """기본 Mock 응답 생성"""
        
        # 책 제목과 내용 분석
        book_title = review_data.get('book_title', '').lower()
        content = review_data.get('content', '').lower()
        genre = review_data.get('genre', 'Fiction')
        rating = review_data.get('rating', 5)
        
        # 감정별 응답 템플릿
        emotion_responses = {
            "Happy": {
                "primary": "기쁨",
                "secondary": "만족",
                "intensity": "높음",
                "message": "책을 통해 느끼신 행복과 기쁨이 전해져 옵니다. 좋은 책과의 만남은 정말 특별한 경험이죠."
            },
            "Sad": {
                "primary": "슬픔",
                "secondary": "아쉬움",
                "intensity": "중간",
                "message": "책이 전하는 감정에 깊이 공감하셨군요. 때로는 슬픔도 우리를 성장시키는 소중한 감정입니다."
            },
            "Excited": {
                "primary": "흥분",
                "secondary": "기대",
                "intensity": "높음",
                "message": "책에 대한 열정이 느껴집니다! 이런 설렘이 다음 독서로도 이어지기를 바랍니다."
            },
            "Thoughtful": {
                "primary": "사색",
                "secondary": "깨달음",
                "intensity": "중간",
                "message": "깊은 생각에 잠기게 하는 책이었군요. 이런 성찰의 시간이 정말 소중합니다."
            },
            "감동적": {
                "primary": "감동",
                "secondary": "여운",
                "intensity": "높음",
                "message": "마음 깊은 곳을 울리는 작품을 만나셨군요. 이런 감동은 오래도록 기억에 남을 것입니다."
            },
            "즐거움": {
                "primary": "즐거움",
                "secondary": "유쾌함",
                "intensity": "높음",
                "message": "독서의 즐거움을 만끽하셨네요! 책장을 넘기는 설렘이 전해집니다."
            },
            "슬픔": {
                "primary": "슬픔",
                "secondary": "먹먹함",
                "intensity": "높음",
                "message": "작품이 전하는 슬픔에 깊이 공감하셨군요. 이런 감정의 깊이가 우리를 더 성숙하게 만듭니다."
            },
            "놀라움": {
                "primary": "놀라움",
                "secondary": "충격",
                "intensity": "높음",
                "message": "예상치 못한 전개에 놀라셨군요! 이런 반전의 묘미가 독서의 큰 즐거움이죠."
            },
            "평온함": {
                "primary": "평온",
                "secondary": "안정",
                "intensity": "낮음",
                "message": "마음의 평화를 찾게 해주는 책이었나 봅니다. 이런 고요한 위로가 때로는 가장 큰 힘이 되죠."
            },
            "흥미로움": {
                "primary": "호기심",
                "secondary": "탐구심",
                "intensity": "중간",
                "message": "지적 호기심을 자극하는 흥미로운 독서였군요. 새로운 지식과 관점을 얻으셨기를 바랍니다."
            },
            "아쉬움": {
                "primary": "아쉬움",
                "secondary": "미련",
                "intensity": "중간",
                "message": "기대와는 다른 면이 있었나 보네요. 하지만 이런 경험도 독서 여정의 의미 있는 한 부분입니다."
            },
            "따뜻함": {
                "primary": "따뜻함",
                "secondary": "포근함",
                "intensity": "중간",
                "message": "마음이 따뜻해지는 이야기였군요. 이런 온기가 일상에도 스며들기를 바랍니다."
            }
        }
        
        emotion_data = emotion_responses.get(
            review_data.get('user_emotion', 'Thoughtful'),
            emotion_responses['Thoughtful']
        )
        
        # 동적 책 통찰 생성
        book_insights = self._generate_dynamic_insights(book_title, content, genre, rating)
        
        # 장르별 추천 도서
        genre_recommendations = {
            "Fiction": [
                {"title": "노르웨이의 숲", "author": "무라카미 하루키", "reason": "섬세한 감성과 인간관계에 대한 깊은 통찰"},
                {"title": "연금술사", "author": "파울로 코엘료", "reason": "삶의 의미와 꿈을 찾아가는 여정"},
                {"title": "데미안", "author": "헤르만 헤세", "reason": "자아 찾기와 성장에 대한 철학적 탐구"}
            ],
            "Non-fiction": [
                {"title": "사피엔스", "author": "유발 하라리", "reason": "인류 역사에 대한 거시적 통찰"},
                {"title": "생각에 관한 생각", "author": "대니얼 카너먼", "reason": "인간 사고의 메커니즘 이해"},
                {"title": "총, 균, 쇠", "author": "제레드 다이아몬드", "reason": "문명 발전의 근본 원인 탐구"}
            ],
            "Self-help": [
                {"title": "미움받을 용기", "author": "기시미 이치로", "reason": "자유롭고 행복한 삶을 위한 철학"},
                {"title": "아주 작은 습관의 힘", "author": "제임스 클리어", "reason": "삶을 변화시키는 습관 설계"},
                {"title": "그릿", "author": "앤절라 더크워스", "reason": "성공을 위한 열정과 끈기의 중요성"}
            ]
        }
        
        recommendations = genre_recommendations.get(
            review_data.get('genre', 'Fiction'),
            genre_recommendations['Fiction']
        )
        
        # AIResponse 스키마에 맞는 형식으로 반환
        from app.models.schemas import EmotionAnalysis, BookRecommendationItem, AIResponse
        
        # EmotionAnalysis 객체 생성
        emotion_obj = EmotionAnalysis(
            primary=emotion_data["primary"],
            secondary=emotion_data["secondary"],
            intensity=emotion_data["intensity"]
        )
        
        # BookRecommendationItem 리스트 생성
        recommendation_objs = [
            BookRecommendationItem(
                title=rec["title"],
                author=rec["author"],
                reason=rec["reason"]
            ) for rec in recommendations
        ]
        
        # AIResponse 객체 생성
        ai_response_obj = AIResponse(
            empathy_message=f"{emotion_data['message']} {review_data['rating']}점의 평점과 함께 남겨주신 감상평이 인상적입니다.",
            book_insights=book_insights,
            emotion_analysis=emotion_obj,
            book_recommendations=recommendation_objs,
            personalized_insight=self._generate_personalized_insight(review_data, emotion_data)
        )
        
        return {
            "ai_response": ai_response_obj.model_dump(),
            "analyzed_at": datetime.now().isoformat()
        }
    
    def _generate_dynamic_insights(self, book_title: str, content: str, genre: str, rating: float) -> List[str]:
        """책과 감상평 내용을 분석하여 동적인 통찰 생성"""
        
        insights = []
        
        # 장르별 기본 통찰
        genre_insights = {
            "소설": [
                "작가의 서사 구조와 인물 묘사가 독자를 이야기 속으로 깊이 끌어들입니다.",
                "허구와 현실의 경계를 넘나들며 인간 본성에 대한 깊은 성찰을 제공합니다.",
                "등장인물들의 내면 갈등과 성장 과정이 우리 자신의 삶을 돌아보게 만듭니다."
            ],
            "에세이": [
                "저자의 개인적 경험과 통찰이 보편적 진리로 승화되는 과정이 인상적입니다.",
                "일상의 소소한 순간들을 특별하게 만드는 저자만의 시선이 돋보입니다.",
                "삶의 지혜와 철학이 담백하면서도 울림 있게 전달됩니다."
            ],
            "자기계발": [
                "실천 가능한 구체적인 방법론과 동기부여가 균형있게 제시됩니다.",
                "개인의 성장과 변화를 위한 실용적인 로드맵을 제공합니다.",
                "이론과 실제 사례의 조화로운 구성이 설득력을 높입니다."
            ],
            "경제/경영": [
                "복잡한 경제 현상을 명쾌하게 풀어내는 저자의 통찰력이 돋보입니다.",
                "비즈니스 전략과 실행에 대한 실무적 관점이 유용합니다.",
                "시대의 변화를 읽고 미래를 예측하는 혜안을 제시합니다."
            ],
            "인문학": [
                "인간과 사회에 대한 근본적인 질문을 던지며 사고의 깊이를 더합니다.",
                "고전의 지혜를 현대적으로 재해석하여 새로운 의미를 발견하게 합니다.",
                "학문적 엄밀성과 대중적 접근성의 균형이 잘 잡혀 있습니다."
            ],
            "과학": [
                "복잡한 과학 원리를 쉽고 흥미롭게 설명하는 저자의 능력이 탁월합니다.",
                "자연 현상 속에 숨겨진 경이로움과 아름다움을 발견하게 합니다.",
                "과학적 사고방식이 일상생활에 어떻게 적용될 수 있는지 보여줍니다."
            ],
            "역사": [
                "과거의 사건들이 현재에 주는 교훈과 의미를 깊이 있게 탐구합니다.",
                "역사적 인물들의 선택과 그 결과가 시대를 어떻게 변화시켰는지 조명합니다.",
                "거시적 흐름과 미시적 디테일의 균형잡힌 서술이 인상적입니다."
            ],
            "예술": [
                "예술 작품 속에 담긴 시대정신과 작가의 철학을 섬세하게 풀어냅니다.",
                "미적 감수성과 비평적 시각을 동시에 길러주는 풍부한 내용입니다.",
                "창작 과정의 고뇌와 열정이 생생하게 전달됩니다."
            ],
            "동화": [
                "어린이의 순수한 시선으로 세상의 진리를 발견하게 합니다.",
                "상상력과 현실의 조화로운 만남이 모든 연령대에 감동을 줍니다.",
                "단순한 이야기 속에 깊은 철학적 메시지가 담겨 있습니다."
            ]
        }
        
        # 장르에 맞는 통찰 선택
        base_insights = genre_insights.get(genre, genre_insights.get("소설", []))
        
        # 평점 기반 통찰 추가
        if rating >= 4.5:
            insights.append(f"이 작품은 {genre} 장르의 정수를 보여주며, 독자에게 깊은 만족감을 선사합니다.")
        elif rating >= 3.5:
            insights.append(f"{genre} 장르의 특성을 살리면서도 독자적인 개성이 느껴지는 작품입니다.")
        else:
            insights.append(f"기대와는 다른 면이 있었지만, 그 자체로 의미 있는 독서 경험을 제공합니다.")
        
        # 감상평 내용 기반 통찰
        if '감동' in content or '눈물' in content:
            insights.append("독자의 감정선을 섬세하게 터치하며 깊은 울림을 전달하는 작품입니다.")
        elif '재미' in content or '흥미' in content:
            insights.append("페이지를 넘기는 손을 멈출 수 없게 만드는 흡입력 있는 전개가 매력적입니다.")
        elif '생각' in content or '고민' in content:
            insights.append("독서 후에도 오래도록 생각하게 만드는 여운과 질문을 남깁니다.")
        elif '배움' in content or '교훈' in content:
            insights.append("지식과 지혜를 동시에 전달하며 독자의 성장을 돕는 가치 있는 작품입니다.")
        else:
            insights.append(base_insights[0])
        
        # 책 제목 기반 특별 통찰
        if '사랑' in book_title:
            insights.append("사랑의 다양한 모습과 의미를 섬세하게 포착하여 독자의 공감을 이끌어냅니다.")
        elif '여행' in book_title or '길' in book_title:
            insights.append("물리적 여정과 내면의 여정이 교차하며 성장과 발견의 서사를 그려냅니다.")
        elif '시간' in book_title or '기억' in book_title:
            insights.append("시간의 흐름 속에서 변하는 것과 변하지 않는 것에 대한 성찰을 제공합니다.")
        else:
            insights.append(base_insights[1] if len(base_insights) > 1 else "작품만의 독특한 매력과 메시지가 독자에게 새로운 시각을 제공합니다.")
        
        # 세 번째 통찰 추가
        insights.append(base_insights[2] if len(base_insights) > 2 else "독서를 통해 얻은 감동과 깨달음이 일상에 긍정적인 영향을 미치기를 바랍니다.")
        
        return insights[:3]  # 최대 3개의 통찰 반환
    
    def _generate_personalized_insight(self, review_data: Dict[str, Any], emotion_data: Dict[str, str]) -> str:
        """개인화된 통찰 생성"""
        
        rating = review_data.get('rating', 5)
        emotion = emotion_data.get('primary', '감동')
        book_title = review_data.get('book_title', '이 책')
        
        if rating >= 4.5:
            return f"'{book_title}'과의 만남이 당신에게 {emotion}의 순간을 선사했듯이, 앞으로의 독서 여정도 이런 특별한 경험들로 가득하기를 바랍니다."
        elif rating >= 3.5:
            return f"'{book_title}'을 통해 느낀 {emotion}이 새로운 독서의 방향을 제시하는 나침반이 되기를 희망합니다."
        else:
            return f"모든 책이 우리에게 완벽한 만족을 주지는 않지만, '{book_title}'과의 만남도 당신의 독서 스펙트럼을 넓히는 의미 있는 경험이 되었을 것입니다."
    
    def _generate_enhanced_mock_response(self, review_data: Dict[str, Any]) -> Dict[str, Any]:
        """향상된 Mock 응답 생성 (API 오류 시 사용)"""
        
        # 책 제목과 저자를 기반으로 한 더 구체적인 분석
        book_title = review_data['book_title'].lower()
        
        # 실제 유명 도서들에 대한 구체적 분석
        specific_books = {
            "어린 왕자": {
                "insights": [
                    "어린 왕자는 순수한 시선으로 어른들의 세계를 비판하며 본질의 중요성을 일깨웁니다.",
                    "사막에서의 만남은 인생에서 진정한 관계의 의미를 되돌아보게 합니다.",
                    "'가장 중요한 것은 눈에 보이지 않는다'는 메시지가 독자의 가치관을 재정립하게 합니다."
                ],
                "recommendations": [
                    {"title": "모모", "author": "미하엘 엔데", "reason": "시간의 소중함과 삶의 본질을 다룬 현대 우화"},
                    {"title": "갈매기의 꿈", "author": "리처드 바크", "reason": "자유와 꿈을 향한 비상을 그린 철학적 우화"},
                    {"title": "연금술사", "author": "파울로 코엘료", "reason": "자아실현과 운명을 찾아가는 영혼의 여정"}
                ]
            },
            "1984": {
                "insights": [
                    "오웰의 디스토피아는 권력과 감시 체제가 개인의 자유를 억압하는 메커니즘을 날카롭게 포착합니다.",
                    "언어의 통제가 사고의 통제로 이어지는 과정을 통해 정보 조작의 위험성을 경고합니다.",
                    "빅브라더의 존재는 현대 사회의 감시 자본주의와 놀라울 정도로 유사합니다."
                ],
                "recommendations": [
                    {"title": "멋진 신세계", "author": "올더스 헉슬리", "reason": "쾌락으로 통제되는 또 다른 형태의 디스토피아"},
                    {"title": "파렌하이트 451", "author": "레이 브래드버리", "reason": "책이 금지된 사회를 통한 지식 통제 비판"},
                    {"title": "우리", "author": "예브게니 자먀틴", "reason": "1984의 원형이 된 최초의 디스토피아 소설"}
                ]
            },
            "데미안": {
                "insights": [
                    "싱클레어의 성장 과정은 우리 모두가 겪는 자아 찾기의 여정을 상징적으로 보여줍니다.",
                    "알과 새의 비유는 기존 가치관을 깨고 새로운 세계로 나아가는 용기의 중요성을 강조합니다.",
                    "아브락사스의 개념은 선과 악을 초월한 전체성의 추구를 의미합니다."
                ],
                "recommendations": [
                    {"title": "싯다르타", "author": "헤르만 헤세", "reason": "깨달음을 향한 영적 여정을 그린 또 다른 걸작"},
                    {"title": "유리알 유희", "author": "헤르만 헤세", "reason": "지성과 예술의 조화를 탐구하는 철학적 소설"},
                    {"title": "수레바퀴 아래서", "author": "헤르만 헤세", "reason": "교육 제도와 개인의 갈등을 다룬 성장소설"}
                ]
            },
            "노르웨이의 숲": {
                "insights": [
                    "상실과 고독 속에서도 계속되는 삶의 아름다움과 쓸쓸함을 섬세하게 그려냅니다.",
                    "청춘의 방황과 사랑의 불완전함이 만들어내는 성장의 아픔을 공감적으로 표현합니다.",
                    "음악과 문학이 어우러진 감각적 서술이 독자를 1960년대 일본으로 이끕니다."
                ],
                "recommendations": [
                    {"title": "상실의 시대", "author": "무라카미 하루키", "reason": "청춘과 상실을 다룬 또 다른 감성적 작품"},
                    {"title": "해변의 카프카", "author": "무라카미 하루키", "reason": "현실과 환상이 교차하는 성장 서사"},
                    {"title": "1Q84", "author": "무라카미 하루키", "reason": "평행우주와 운명적 사랑을 그린 대작"}
                ]
            },
            "사피엔스": {
                "insights": [
                    "인지혁명, 농업혁명, 과학혁명을 통해 인류 문명의 거대한 흐름을 조망합니다.",
                    "허구를 믿는 능력이 어떻게 대규모 협력을 가능하게 했는지 설득력 있게 설명합니다.",
                    "기술 발전이 반드시 행복의 증진으로 이어지지 않는다는 통찰이 의미심장합니다."
                ],
                "recommendations": [
                    {"title": "호모 데우스", "author": "유발 하라리", "reason": "인류의 미래를 예측하는 후속작"},
                    {"title": "총, 균, 쇠", "author": "제레드 다이아몬드", "reason": "문명 발전의 지리적 요인 분석"},
                    {"title": "문명의 충돌", "author": "새뮤얼 헌팅턴", "reason": "현대 문명의 갈등 구조 이해"}
                ]
            }
        }
        
        # 기본 응답 생성
        base_response = self._generate_mock_response(review_data)
        
        # 특정 책에 대한 분석이 있다면 업데이트
        for book_key, book_data in specific_books.items():
            if book_key in book_title:
                base_response["ai_response"]["book_insights"] = book_data["insights"]
                base_response["ai_response"]["book_recommendations"] = book_data["recommendations"]
                base_response["ai_response"]["personalized_insight"] = f"'{review_data['book_title']}'의 깊이 있는 메시지가 당신의 삶에 의미 있는 변화를 가져다주기를 바랍니다. 이 특별한 독서 경험이 앞으로의 책 선택에도 좋은 가이드가 되길 희망합니다."
                break
        
        return base_response