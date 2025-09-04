#### 설계 방식
요구사항 명세
응집도와 결합도를 고려하여 개념적 설계, 논리적 설계, 물리적 설계
docs에 문서화 할 것.

#### 기술 스택
spring boot 3.5.4 gradle java 21
fast api
react
mysql

#### 설정
환경설정 해야하는 것을 먼저 처리하도록. 그리고 mysql같은 것도 도커 컨테이너를 생성해서 이미지를 다운받기 먼저.

#### 개발 방식
DDD와 TDD로 진행.
응집도와 결합도를 고려하고, spring mvc구조를 지키기

#### 테스트 방식

도메인 하나를 개발할 때마다 엄밀하게 단위테스트 통합테스트 진행.

Repository, service, controller 테스트
TestContainer 학습 후 적용

스프링 테스트 코드 생성은
mokito bean과 test slice로
assertThat, assertAll, assertTrue, assertNotNull, assertEquals, assertThrows, (+ Mockito verify()) 등을 활용

테스트 객체 생성 라이브러리 Fixture Monkey 적용 [https://naver.github.io/fixture-monkey/v1-1-0/](https://naver.github.io/fixture-monkey/v1-1-0/)

백엔드 개발 완료 후, 테스트 고도화 진행시 etoe 테스트 진행