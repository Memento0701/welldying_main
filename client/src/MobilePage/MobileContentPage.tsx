import React from 'react';
import { useSelector } from 'react-redux';
import { match } from 'react-router';
import { Link } from 'react-router-dom';
import { parseDate } from '../etc';
import { getAnswers, writeAnswer } from '../etc/api/answer';
import { getContents } from '../etc/api/content';
import { uploadImage_formdata } from '../etc/api/image';
import { getQuestions } from '../etc/api/question';
import usePromise from '../etc/usePromise';
import { Colon, LeftArrowVector, leftVector, like_vector, rightVector, shareVector } from '../img/Vectors';
import MobileContentbox from '../MobileComponents/MobileContentbox';
import MobileHeader from '../MobileComponents/MobileHeader';
import MobileNavigation from '../MobileComponents/MobileNavigation';
import { RootReducer } from '../store';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function MobileContentPage({ match }: Props) {
    let user = useSelector((state: RootReducer) => state.user);
    let id = Number.parseInt(match.params.id);
    let [, allContents] = usePromise(getContents);
    let [, allQuestions] = usePromise(getQuestions);
    let content = allContents?.find((content) => content.id === id);
    let question = allQuestions?.find((question) => question.id === content?.question);
    let categoryAllContents = React.useMemo(() => {
        return allContents?.filter((content) => content.category.includes(content.category[0]));
    }, [allContents]);
    let [width, setWidth] = React.useState<number>(0);
    let [answerCol, setAnswerCol] = React.useState<number>(0);
    let [answerRow, setAnswerRow] = React.useState<number>(5);
    let [answerLength, setAnswerLength] = React.useState<number>(0);
    let [, setAnswerByteLength] = React.useState<number>(0);
    let [answer, setAnswer] = React.useState<string>('');
    let [imageUri, setImageUri] = React.useState<string>('');
    React.useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
            setAnswerCol(((window.innerWidth - 68) - (window.innerWidth - 68)%7)/7);
        }
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    })
    let setAnswerRowCalculate = (message: string) =>  { 
        let bytemessage = message.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1");
        let bytelength = bytemessage.length;
        let bytemessageArray = bytemessage.split('\n');
        let newRow = 0;
        bytemessageArray.map((byte) => {
            let bytelen = byte.length;
            newRow += (bytelen - bytelen/answerCol)/answerCol + 1;
            newRow = parseInt(String(newRow));
            return newRow;
        })
        setAnswerByteLength(bytelength);
        setAnswerRow(Math.max(5, newRow));
    }
    let [contentsNum, setContentsNum] = React.useState<number>(4);
    let [showanswer, setShowAnswer] = React.useState<boolean>(false);

    let [, allAnswers] = usePromise(getAnswers);
    let userAnswer = React.useMemo(() => {
        if(!allAnswers || !user || !user.user || !question) return;
        else {
            return allAnswers?.find((answer) => answer.username === user.user?.username && answer.questionId === question?.id);
        };
    }, [allAnswers, user, question]);

    React.useEffect(() => {
        if(!userAnswer) return;
        setAnswer(userAnswer.message);
        setAnswerLength(userAnswer.message.length);
        let bytemessage = userAnswer.message.replace(/[\0-\x7f]|([0-\u07ff]|(.))/g,"$&$1");
        let bytelength = bytemessage.length;
        let bytemessageArray = bytemessage.split('\n');
        let newRow = 0;
        bytemessageArray.map((byte) => {
            let bytelen = byte.length;
            newRow += (bytelen - bytelen/answerCol)/answerCol + 1;
            newRow = parseInt(String(newRow));
            return newRow;
        })
        setAnswerByteLength(bytelength);
        setAnswerRow(Math.max(5, newRow));
        if(!userAnswer.imageData || userAnswer.imageData.imageUrl === '')
            setImageUri('');
        else setImageUri(userAnswer.imageData.imageUrl);
    }, [userAnswer, answerCol])

    //pageVariable
    let pagetotalnumber = React.useMemo(() => content?.detail.bookdetail.length, [content]);
    interface touchData {
        initialX: number;
        initialY: number;
        LRdir: number;
        UDdir: number;
    }
    let [PageTouchData, setPageTouchData] = React.useState<touchData>({ initialX: 0, initialY: 0, LRdir: 0, UDdir: 0 });

    let dragDirection = (e:any) => {
        if(PageTouchData.initialX !== 0 && PageTouchData.initialY !== 0 && pagetotalnumber) {
            const currentX = e.touches ? e.touches[0].clientX : e.clientX;
            const currentY = e.touches ? e.touches[0].clientY : e.clientY;

            let diffX = PageTouchData.initialX - currentX;
            let diffY = PageTouchData.initialY - currentY;
            setPageTouchData({initialX: 0, initialY: 0 , LRdir: (diffX > diffY && diffX > 0) ? Math.max(PageTouchData.LRdir - 1, -(pagetotalnumber - 1)) : Math.min(PageTouchData.LRdir + 1, 0), UDdir: (diffY > diffX && diffY > 0) ? Math.max(PageTouchData.UDdir - 1, -(pagetotalnumber - 1)) : Math.min(PageTouchData.UDdir + 1, 0)});
        }
    }

    //save answer
    let [save, setSave] = React.useState<boolean>(false);
    let input_file = React.useRef<any>(null);
    let [, setCropImage] = React.useState<boolean>(false);
    let handleFileinput  = async (e: any) => {
        let formData = new FormData();
        formData.append('image', e.target.files[0]);

        const s3Uri = await uploadImage_formdata(formData);
        console.log(s3Uri);
        setImageUri(s3Uri);
        if(s3Uri === undefined) {
        setImageUri('https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png');
        }
        return s3Uri;
    }
    let handleClick = () => {
        input_file.current.click();
    };

    //Redirect
    let loginRef = React.useRef<any>(null);
    let loginRefClick = () => loginRef.current.click();

    //Scroll
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    //summary
    let [SummaryLength, setSummaryLength] = React.useState<number>(150);

    if(!content) return <></>;
    else return (
        <>
            <div className="Mobile">
                <MobileHeader uri = {`/contentpage/${id}`} />
                <div className="MobileContentPage">
                    <div className="coverContainer">
                        <div className="image" onClick = {() => window.open(content?.source, '_blank')}>
                            <img src={content?.imageData.imageUrl} alt="" style = {{maxHeight: '400px', objectFit: (content.type === '책' && width > 450) ? 'contain' : 'cover'}}/>
                        </div>
                        <div className="cover">
                            <div className="title">
                                {content.title}
                            </div>
                            <div className="sharebutton">
                                {shareVector}
                            </div>
                            <div className="likebutton">
                                {like_vector}
                            </div>
                            <div className="tag">
                                {content.tag}
                            </div>
                            <div className="date">
                                {'date : ' + parseDate(new Date(Number(content.date)))}
                            </div>
                        </div>
                        <div className="source" onClick = {() => window.open(content?.source, '_blank')}>
                            {'출처 : ' + content.source}
                        </div>
                    </div>
                    {content.type === '책' && <div className="bookContent">
                        <div className="pageContainer" style = {{transition: 'all 0.8s ease-in-out', left: `${Math.min(22, (width - 320)/2) + 'px'}`, marginRight: `${Math.min(22, (width - 320)/2) + 'px'}`, transform: `translateX(${(Math.min(400, Math.max(width - 44, 320)) + 44) * PageTouchData.LRdir + 'px'})`}} onTouchStart = {(e: any) => {setPageTouchData({...PageTouchData, initialX: e.touches ? e.touches[0].clientX: e.clientX , initialY: e.touches ? e.touches[0].clientY: e.clientY })}} onTouchMove = {(e: any) => {
                            dragDirection(e);
                        }}>
                            {[...Array(pagetotalnumber).keys()].map((key => {
                            if(key === 0) {
                                return (
                                    <div className="page" style = {{width: `${(Math.min(400, Math.max(320, (width - 44)))) + 'px'}`,}}>
                                        <div className="number" >#1</div>
                                        <div className="subtitle" style = {{marginTop: '5px'}}>{content?.detail.subtitle}</div>
                                        <textarea name="" id="" cols = {36} rows={7} className="detail" value = {content?.detail.bookdetail[0]} style  = {{ textAlign: 'justify'}} readOnly></textarea>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="page" style = {{width: `${(Math.min(400, Math.max(320, (width - 44)))) + 'px'}`,}}>
                                        <div className="number">{' '}</div>
                                        <textarea name="" id="" cols = {36} rows={10} className="detail" value = {content?.detail.bookdetail[key]} readOnly></textarea>
                                    </div>
                                );
                            }
                            }))}
                        </div>
                        <div className="buttonContainer">
                            <button className="left" onClick = {() => setPageTouchData({initialX: 0, initialY: 0, LRdir: Math.min(PageTouchData.LRdir + 1, 0), UDdir: Math.min(PageTouchData.LRdir + 1, 0)})}>{leftVector}</button>
                            <div className="pagenumber NS px14 bold">{(-PageTouchData.LRdir + 1) + '/' + (pagetotalnumber)}</div>
                            <button className="right" onClick = {() => setPageTouchData({initialX: 0, initialY: 0, LRdir: Math.max(PageTouchData.LRdir - 1, -(Number(pagetotalnumber) - 1)), UDdir: Math.max(PageTouchData.LRdir - 1, -(Number(pagetotalnumber) - 1))})}>{rightVector}</button>
                        </div>
                    </div>}
                    <div className="summaryContainer">
                        <div className="title">영상 내용 요약</div>
                        <div className="summary">{content.detail.summary.slice(0, SummaryLength)}{(content.detail.summary.length > SummaryLength ? <span onClick = {() => setSummaryLength(Number(content?.detail.summary.length))}>...더보기</span> : '')}</div>
                    </div>
                    {question && <div className="questionContainer">
                        <Link to = {{ pathname: "/login", state: {
                            from: `contentpage/${id}`
                        }}} ref = {loginRef} style = {{display: "none"}} />
                        <div className="title">연관 질문</div>
                        <div className="main">
                            <div className="textContainer">
                                <div className="question">
                                    <div className="Colon">{Colon}</div>
                                    <div className="title">{question?.title}</div>
                                </div>
                            </div>
                            {showanswer && <div className="WriteContainer" onClick = {user.loggedIn ? () => {} : () => {
                                alert("로그인 후 이용해주십시오.");
                                loginRefClick();
                            }}>
                                <div className="textarea">
                                    <textarea name="" id="" cols={answerCol} rows={answerRow} value = {answer} onChange = {(e) => {
                                        setAnswer(e.target.value.slice(0, 549));
                                        setAnswerLength(Math.min(550, e.target.value.length))
                                        setAnswerRowCalculate(e.target.value.slice(0, 549));
                                    }}></textarea>
                                    <div className="lineContainer">
                                        {[...Array(answerRow).keys()].map(() => {
                                            return (
                                                <div className="line"></div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="answerlength">
                                    {answerLength + ' / 550 자'}
                                </div>
                                <div className="imageContainer" onClick = {() => {handleClick(); setCropImage(true);}}>
                                    <img src = {(imageUri === '' ? 'https://memento82.s3.ap-northeast-2.amazonaws.com/image_uploader.png' : imageUri)} alt="" style = {{width: (imageUri === '' || imageUri === undefined) ? 50 : width - 108, height: (imageUri === '' || imageUri === undefined) ? 50 : width - 108}}/>
                                    <input type = 'file' onChange={e => {handleFileinput(e)}} style = {{display: 'none'}} ref = {input_file}/>
                                </div>
                            </div>}
                            <div className="saveContainer">
                                {(save && showanswer) && <div className = 'saveConfirm'>
                                    <div className="text">안전하게 저장되었습니다.</div>
                                    <div className="button" onClick = {() => {
                                        setSave(false);
                                        setShowAnswer(false);
                                    }}>확인</div>
                                </div>}
                                <div className="showanswer" style = {{background: showanswer ? 'rgba(144, 150, 147, 1)' : '', color: showanswer ? '#FFF' : ''}} onClick = {showanswer ? async () => {
                                if(await writeAnswer(Number(question?.id), answer, answer.length, { imageUrl: imageUri, cropX: 0, cropY: 0 }))
                                    setSave(true);
                                } : () => setShowAnswer(!showanswer)}>{showanswer ? '저장하기' : '답변 작성하기'}
                                </div>
                            </div>
                        </div>
                    </div>}
                    <div className="moreContents">
                        <div className="title">
                            연관 컨텐츠
                        </div>
                        <div className="contentsContainer">
                            {categoryAllContents?.slice(0, contentsNum).map((content) => {
                                return (
                                    <MobileContentbox type = 'big' content = {content}/>
                                )
                            })}
                        </div>
                        {contentsNum < categoryAllContents?.length && <div className="more" onClick = {() => setContentsNum(contentsNum + 4)}>
                            <div>더보기</div>
                            <div className = "vector">{LeftArrowVector}</div>
                        </div>}
                    </div>
                </div>
                <MobileNavigation />
            </div>
        </>
    );
}

export default MobileContentPage;