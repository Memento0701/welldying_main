메멘토 팀의 웰다잉 웹 서비스 프로젝트입니다. 서비스는 현재 https://mymemento.kr 에서 서비스되고 있습니다.

# 프로젝트 구조

프로젝트는 client 폴더와 server 폴더로 이루어져 있습니다. 두 폴더는 각각 사이트의 클라이언트(흔히 Frontend라고 부르는, 사용자에게 보이는 웹 페이지)와 서버(흔히 Backend라고 부르는, 사용자에게 데이터를 전달받고 전달하는 컨트롤러)를 이루고 있습니다. 두 폴더는 각각 독립적인 프로젝트이지만, 서로를 필요로 합니다.

## 클라이언트

클라이언트는 물론 웹사이트이므로 Javascript로 짜여져 있습니다. 생산성을 높이기 위해 Typescript, SCSS를 적용하고, React 프레임워크를 이용해 SPA(Single Page Application)으로 만들어져 있습니다.

클라이언트 프로젝트는 모두 `/client` 폴더 안에 구성되어 있습니다. 소스 코드는 `/src` 안에서 모두 관리되고 있으며, 리소스 파일은 `/public` 폴더에 있습니다.

`/public/img`는 프론트엔드에서 사용할 이미지를 모아둔 폴더로 사용할 이미지가 있다면 해당 폴더에 추가 후 사용가능합니다.

`/src/App.tsx`의 경우 새로운 페이지를 추가할 때에 사용합니다. <Route>를 만들고 path에 mymemento.kr뒤에 올 주소, 그리고 component 뒤에 `/src`에 있는 다른 컴포넌트를 집어넣어 만들 수 있습니다.

`/src` 내부에서 `/components`는 PC 페이지에 사용될 작은 요소들을 하나의 파일로 만들어 둔 것으로 다른 컴포넌트에서 사용합니다. `/etc`폴더는 백엔드 데이터를 가져오기 위한 파일을 모아둔 폴더이며 그 외에 몇몇 개발에 유용한 파일을 만들어뒀습니다. `/MobilePage`폴더는 모바일에서 사용할 페이지의 컴포넌트를 모아둔 폴더입니다. `/MobileComponents`는 모바일에서 사용할 작은 요소들을 하나의 파일로 만들어두어 모아둔 폴더입니다. `/pages`폴더는 PC에서 사용할 페이지의 컴포넌트를 모아둔 폴더입니다. `/store`폴더는 유저 로그인을 위한 파일이 모인 폴더입니다. `/styles`폴더는 웹페이지 디자인을 위해 사용하는 파일을 모아둔 폴더입니다. `/YouthTestament`폴더는 이번 횡성 청춘유언 프로젝트를 위한 파일을 모아둔 폴더입니다.

클라이언트는 memento AWS의 S3 서비스에서, 정적 웹사이트로서 https://mymemento.kr 에 배포되어 있습니다. (서버가 실행되고 있는 EC2에서 nginx proxy를 적절히 이용해서 같이 배포되는 게 더 바람직하지만, 현재는 이 방법을 사용하고 있습니다. ) 보안 연결 (https) 제공은 AWS Cloudfront에서 하고 있습니다.

## 서버

서버 또한 Javascript로 짜여져 있습니다. 클라이언트의 Javascript는 사용자의 웹 브라우저에서 실행하게 되지만 서버의 Javascript는 서버 컴퓨터에서 Node.js 기반으로 항상 실행된다는 점을 잊지 마세요. 서버를 열기 위해 Express를 사용하였습니다.

서버 프로젝트는 모두 `/server` 폴더 안에 구성되어 있습니다. 소스 코드는 `/server/src` 안에서 모두 관리되고 있습니다.

`/@types` 폴더와 `/handlers` 폴더는 이미 구성되어 있어 건드릴 필요 없습니다. `/loaders` 폴더는 각각의 기능을 수행하기 위해 만들어진 파일들을 모아둔 폴더입니다. `mongooseLoader.ts`, `routeLoader.ts`를 변경하는 경우가 제일 많으며 이는 새로운 데이터베이스를 만들었을 때 사용합니다. 새로운 데이터베이스를 만들었을 때 `/models` 폴더와 `/routes` 폴더 내에 각각 새로운 데이터베이스에 해당하는 model과 route를 설정해주어야합니다.

서버 프로젝트는 memento AWS의 EC2 서비스 안에서 pm2를 이용해 실행되고 있습니다. 서버 API의 보안 연결 (https) 제공은 오픈소스 letsencrypt를 이용해 이루어지고 있고, nginx의 proxy 기능을 통해 https://api.mymemento.kr 에서 접속할 수 있습니다.

서버는, 다음 두 서비스와 연결되어 있습니다: mongoDB, AWS (Amazon Web Service). 이 두 서비스와 연결하기 위해 해야 하는 일들은 후술합니다.

# 프로젝트를 실행하기 전

로컬 환경에서 프로젝트를 설정하려면, 먼저 npm (node.js package manager)과 yarn을 설치해야 합니다. 각각의 설치 방법을 모른다면 검색해보길 바랍니다.

이후, 프로젝트를 개발자의 컴퓨터에서 실행하기 위해서는 아래 문단의 클라이언트 세팅과 서버 세팅을 모두 끝내야 합니다.

## 클라이언트

- [Kakao Developers](https://developers.kakao.com/) 에서 oAuth를 지원하는 새로운 애플리케이션을 만들어, JS key를 받아와야 합니다. 이 JS Key는, '카카오 계정으로 로그인' 기능에 사용됩니다.

- [Google Developers](https://developers.google.com/) 에서 oAuth를 지원하는 새로운 애플리케이션을 만들어, Client ID를 받아와야 합니다. 이 Client ID는, '구글 계정으로 로그인' 기능에 사용됩니다.

- 위 정보들을 이용해 `.env` 파일들을 설정해야 합니다. 두 개의 파일, `.env.development` 파일과 `.env.production` 파일을 `/client` 폴더 안에 생성해야 합니다. `.env.development` 파일에는 로컬에서 테스트하기 위한 환경 변수를 , `.env.production` 파일에는 실제 배포용 환경 변수를 아래 형식으로 넣어야 합니다. 다만, 두 파일에 넣을 내용은 한 줄을 제외하고 모두 같습니다. `.env.production` 파일에는 아래 세 줄에 걸친 텍스트가 있어야 합니다. `.env.development` 에는 맨 윗 줄을 제외한 두 줄의 텍스트가 있어야 합니다.

```
REACT_APP_API_ADDRESS = https://api.mymemento.kr (이 줄은 .env.development에는 없어야 합니다.)
REACT_APP_KAKAO_JSKEY = (Kakao oAuth2 login JS Key)
REACT_APP_GOOGLE_CLIENT_ID = (Google oAuth2 login client ID)
```

## 서버

- MongoDB에 연결합니다. 로컬 MongoDB를 구축할 수도 있지만, [MongoDB 사이트](https://www.mongodb.com/)의 계정을 만들면 잘 세팅된 클라우드 DB를 사용할 수 있습니다. 개인 계정에서 테스트용 클라우드 DB의 URI를 `.env.development`에 넣으면 됩니다.

- AWS에 연결합니다. 할 일이 몇 가지 있습니다. 아래 두 과정을 자신의 AWS 계정에서 실행한 결과를 `.env.development`에 넣으면 됩니다.

  - [S3](https://s3.console.aws.amazon.com/s3/home) 버킷을 하나 만듭니다. 이름은 원하는 대로 하나 만들면 됩니다. 이 버킷은 사용자가 사진, 영상 등의 파일을 업로드할 때 이를 저장하기 위해 사용합니다.

  - [IAM](https://console.aws.amazon.com/iam/home#/home) 탭에서, 계정을 하나 만듭니다. 만드는 계정은 `AmazonS3FullAccess` 권한과 `AmazonSNSFullAccess` 권한을 가지고 있어야 합니다. 이건 개발자님이 활용할 계정은 아니고, 개발자님이 만든 서버에게 권한을 부여하기 위한 계정입니다. 이 계정의 Access Key ID와 Secret Access Key를 기록해 두세요.

- 위 정보들을 이용해 `.env` 파일들을 설정해야 합니다. 두 개의 파일, `.env.development` 파일과 `.env.production` 파일을 `/server` 폴더 안에 생성해야 합니다. `.env.development` 파일에는 로컬에서 테스트하기 위한 환경 변수를 , `.env.production` 파일에는 실제 배포용 환경 변수를 아래 형식으로 넣어야 합니다. `.env.development` 파일에 들어갈 테스트용 환경 변수들은 모두 직접 만들어주셔야 하지만, `.env.production` 파일에 들어갈 배포용 환경 변수는 전임자가 전달해드릴 것입니다.

```
MONGODB_URI = (서버에 연결할 MongoDB URI)
SESSION_SECRET = (기존의 개발자에게 전달받은 문자열을 그대로 사용하여야 한다.)
AWS_ACCESS_KEY_ID = (AWS IAM의 Access Key ID)
AWS_SECRET_ACCESS_KEY = (AWS IAM의 Secret Access Key)
AWS_S3_BUCKET_NAME = (위 AWS IAM을 이용해 접근하게 할 S3 Bucket 이름; 방금 만든 S3 버킷 이름을 적으면 됩니다)
GOOGLE_CLIENT_ID = (Google oAuth2 login client ID. 위 클라이언트 .env 파일을 설정했을 때와 같은 문자열)
ADMIN_SECRET = (기존의 개발자에게 전달받은 문자열을 그대로 사용하여야 한다.)
IS_TESTING = 1 (이 줄은 .env.development 파일에만 포함되고 .env.production 파일에서는 제거되어야 한다.)
```

KEY_ID = AKIA2YJVTTKIJD3UG7MD
ACCESS_KEY = +VW4OYL+9OGf81nvIu7Uqwy+RcqteBwwBTi3o1kk

# 프로젝트를 실행하려면 ( 제일 상위 폴더에서 사용 )

메인 폴더에서, 다음 커맨드들을 커맨드라인(Console, Terminal 등, VS Code를 이용한다면 간편하게 커맨드라인을 만들 수 있습니다)에 입력할 수 있습니다.

- `yarn install-all`: 클라이언트 프로젝트와 서버 프로젝트 모두, 프로젝트를 실행하기 위해 필요한 패키지를 내려받습니다. 패키지들이 아주 많아 용량이 매우 크니 유의하세요. 첫 실행에서는 3분 이상 걸리지만, 한 번 내려받은 다음에는 다시 내려받을 필요가 없습니다.

- `yarn watch`: 클라이언트 프로젝트와 서버 프로젝트 모두, 프로젝트를 실행합니다. 서버 프로젝트는 http://localhost:5000 에, 클라이언트 프로젝트는 http://localhost:3000 에 실행됩니다. 실행된 프로젝트들은 별도의 새로고침 없이 클라이언트/서버 코드를 수정하면 빠르게 다시 실행(hot reload)됩니다.

즉, 클라이언트 프로젝트와 서버 프로젝트를 모두 실행해 보기 위해서는, 루트 폴더에서, 먼저 `yarn install-all`을 입력하고, `yarn watch`를 입력하면 됩니다. 약 20초간 기다린 뒤 `http://localhost:3000` 에 접속하면 (따로 열지 않아도 자동으로 브라우저 탭이 열립니다) 프로젝트를 실행할 수 있습니다.

## 클라이언트 폴더 커맨드

클라이언트 폴더로 이동하면 (`cd client`) 다음 커맨드들을 이용할 수 있습니다.

- `yarn`: 클라이언트 프로젝트를 실행하기 위해 필요한 패키지를 내려받습니다. 패키지들이 아주 많아 용량이 매우 크니 유의하세요. 첫 실행에서는 3분 이상 걸리지만, 한 번 내려받은 다음에는 다시 내려받을 필요가 없습니다.

- `yarn watch`: 클라이언트 프로젝트를 http://localhost:3000 에 실행합니다. 실행된 프로젝트는 별도의 새로고침 없이 클라이언트 코드를 수정하면 빠르게 다시 실행(hot reload)됩니다. 빌드되는 클라이언트 결과물은 `http://localhost:5000`에서 서버가 실행되고 있지 않으면 서버와 통신하는 부분이 작동하지 않습니다. 이 명령어는 서버 프로젝트를 실행하지 않습니다.

- `yarn build`: 클라이언트 프로젝트를 빌드합니다. 빌드하면 `/client/build` 폴더에 빌드 결과물이 생기며, 실제로 배포하는 것은 이 결과물입니다. 빌드되는 클라이언트 결과물은 `https://api.memento.com`에서 서버가 실행되고 있지 않으면 서버와 통신하는 부분이 작동하지 않습니다.

- `yarn deploy-prod`: 클라이언트 프로젝트를 빌드한 다음 실행해야 합니다! `/client/build` 폴더에 있는 빌드 결과물을 서버(AWS)에 배포합니다. [이 도움말](https://docs.aws.amazon.com/ko_kr/cli/latest/userguide/cli-configure-profiles.html)을 참조해서, 로컬에 `welldying-prod`라는 이름의 AWS 프로파일을 미리 만들어두어야 합니다. 이 프로파일의 Access Key ID와 Secret Access Key는 메멘토 AWS 서버에서 `AmazonS3FullAccess` 권한만을 가진 IAM 계정의 것으로 새로 만들어서 사용해주시면 됩니다.

Access Key ID - AKIA2YJVTTKICFGAF2FN
Secret Access Key - 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

## 서버 폴더 커맨드 ( 굳이 하지 않아도 됩니다 )

서버 폴더로 이동하면 (`cd ./server`) 다음 커맨드들을 이용할 수 있습니다.

- `yarn`: 서버 프로젝트를 실행하기 위해 필요한 패키지를 내려받습니다. 패키지들이 아주 많아 용량이 매우 크니 유의하세요. 첫 실행에서는 3분 이상 걸리지만, 한 번 내려받은 다음에는 다시 내려받을 필요가 없습니다.

- `yarn watch`: 서버 프로젝트를 http://localhost:5000 에 실행합니다. 실행된 프로젝트는 별도의 새로고침 없이 서버 코드를 수정하면 빠르게 다시 실행(hot reload)됩니다. 이 명령어는 클라이언트 프로젝트를 실행하지 않습니다.

- `yarn start-prod`: 실제 서버의 환경에서 (즉, `.env.production` 환경 변수를 이용하여) 서버 프로젝트를 실행합니다. 실행된 프로젝트는 서버 코드를 수정해도 hot reload되지 않습니다. 이 명령어는 클라이언트 프로젝트를 실행하지 않습니다.

# 프로젝트를 배포하려면

배포하기 전! 먼저 자신의 IP가 memento AWS EC2 IP 화이트리스트와 memento mongoDB IP 화이트리스트에 포함되어있는지 확인하고, 없으면 추가해주세요!
각각 네트워크 보안 탭에서 추가할 수 있습니다.

먼저 클라이언트 폴더에 들어가서 `yarn build && yarn deploy-prod`를 이용해 정적 배포합니다. 다음, memento AWS EC2에 접속하여 `~/welldying` 폴더에 있는 클론된 레포지토리에 들어가서, `git pull` 명령어를 입력합니다. (이를 위해 [PAT](https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token)를 만들어야 할 거에요..) Pull이 끝났으면 자동으로 서버가 재시작되겠지만 (`~/welldying/server` 폴더에서 `pm2 log` 또는 `pm2 monit`를 입력하면 실시간으로 현황을 볼 수 있습니다) 수동으로 서버를 재시작하고 싶을 때에는 `~/welldying/server` 폴더에서 `pm2 stop server && pm2 start`를 입력해 서버를 재시작할 수 있습니다.

ssh -i memento_welldying.pem ubuntu@ec2-3-38-20-42.ap-northeast-2.compute.amazonaws.com 로 접속할 수 있습니다.

serve로 배포하기

local storage
session storage

ssh -i memento_welldying.pem ubuntu@ec2-3-38-20-42.ap-northeast-2.compute.amazonaws.com
git token - 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
mongodb -
C1iaumVlaIIt2xg5
(p4r4dox82)
G97tqLjqFTn2kLVx
(memento)
MONGODB_URI = mongodb+srv://new_user_1:C1iaumVlaIIt2xg5@clustero.dy5zg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

MONGODB_URI = mongodb+srv://Memento:G97tqLjqFTn2kLVx@cluster0.m4bo9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

# Git

Git을 이용해 프로젝트를 관리할 수 있습니다. 현재에는 https://www.github.com/junis3/welldying 레포지토리에서 모든 수정이 관리되고 있습니다. 이 소스 코드를 편집하려면, 이 레포지토리를 개발자(혹은 개발 팀)의 레포지토리에 포크(fork)한 다음 편집해주세요..

git access tokens - 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

+---[RSA 3072]----+
| .oo=|
| .oo+.|
| . _=..=|
| . o + o_=o|
| S + ..++o|
| . O . ..=o|
| + + . +++|
| . o o+\*o|
| . oB.E|
+----[SHA256]-----+

# 주의점

- 클라이언트와 서버 코드 모두 패키지 매니저로 yarn을 사용합니다. 전통적으로 쓰이는 패키지 매니저인 npm을 섞어쓰지 않도록 유의하세요. yarn은 npm에 속해있으며, 또 매우 유사하게 작동하지만, 둘을 섞어쓰는 것은 권장되지 않습니다. 예를 들어, 패키지를 추가할 때에 `npm install` 구문을 사용하지 말고 `yarn add` 구문을 사용하세요. `package-lock.json` 파일은 생기면 안 되는 파일이니, (대신 `yarn.lock` 파일이 있어야 합니다) 실수로 만들게 되더라도 지워주세요.

- 서버의 코드는 대부분의 강좌들과 인터넷에서 찾아볼 수 있는 Express 코드와는 다르게 Typescript와 ES6이 적용되어 있습니다. CommonJS의 권장되지 않은 옛 문법 (`var` 등..)을 사용하지 않도록 주의해주세요. CommonJS에서 쓰이는 패키지 추가 방식인 `require` 구문은 권장되지 않으며 (특히 typescript와 같이 사용하면 최악의 궁합을 자랑합니다), `import` 문으로 대체해주셔야 합니다. req, res의 Type도 조심하시고 여차하면 `/server/src/@types` 폴더에 내용을 추가해야 할 수 있습니다..

- 개발하는 과정에서 패키지를 설치할 때에 루트 폴더에 설치하지 않도록 주의하세요. `/client` 폴더나 `/server` 폴더에 설치해야 합니다.

1. nginx를 이용해서 Port Forwarding하기

2. SSH 인증서 발급받기 (Let's Encrypt)

nginx renewal

sudo certbot renew 후 nginx restart
