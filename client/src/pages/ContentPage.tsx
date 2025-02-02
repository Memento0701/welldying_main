import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContentCover from '../components/ContentCover';
import ContentType from '../components/ContentType';
import ContentQuestion from '../components/ContentQuestion';
import ContentBorder from '../components/ContentBorder';
import Contentbox from '../components/Contentbox';
import { getContents, content_userdata } from '../etc/api/content';
import usePromise from '../etc/usePromise';
import { match } from 'react-router-dom';
import { imageUrl } from '../etc/config';
import { parseDate } from '../etc';
import { useSelector } from 'react-redux';
import { RootReducer } from '../store';

interface MatchParams {
    id: string;
};

interface Props {
    match: match<MatchParams>;
};

function ContentPage ({ match } : Props) {
    let user = useSelector((state: RootReducer) => state.user);
    let [userdata, setUserdata] = React.useState<{ likes: string[], bookmark: string[], read: string[] }>({ likes: [], bookmark: [], read: [] });
    let id = Number.parseInt(match.params.id);
    let [, contents] = usePromise(() => getContents());
    let content = React.useMemo(() => contents?.find((content) => content.id === id), [id, contents]);
    let maxContentId = React.useMemo(() => contents ? Math.max(...contents.map(content => content.id)) : 0, [contents]);
    let [title, setTitle] = React.useState<string>('');
    let [tag, setTag] = React.useState<string>('');
    let [type, setType] = React.useState<string>('');
    let [, setSummary] = React.useState<string>('');
    React.useEffect(() => {
        if(!content) return;
        setTitle(content.title);
        setTag(content.tag);
        setType(content.type);
        setSummary(content.detail.summary);
        setUserdata(content.userdata);
    }, [content]);
    React.useEffect(() => {
        if(user.loggedIn) {
            let new_userdata = userdata;
            if(userdata.read.find((username) => (username === user.user!.username)) === undefined) {
                new_userdata.read.push(user.user!.username);
                setUserdata(new_userdata);
                content_userdata(id, new_userdata);
            }
        }
    }, [user, userdata,id]);
    let [more_contents_count, setMore_contents_count] = React.useState<number>(6);
    let [more_contents, setMore_contents] = React.useState<Array<any>>(contents?.slice(0, more_contents_count));

    React.useEffect(() => {
        setMore_contents(contents?.slice(0, more_contents_count));
    }, [more_contents_count, contents]);

    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    let ContentPageHtml = React.useMemo(() => {
        if(!content) return <></>;
        return (
            <>
            <Header additionalClass = '' />
            <ContentCover additionalClass = '0' title = {title} tag = {tag} date = {String(parseDate(new Date(Number(content?.date))))} source = {content?.source}/>
            <ContentType additionalClass = {type} content = {content}/>
            <div className = 'block contentpage' style = {{marginTop: '176px'}}>
                <div className = 'contentsummary margin_large'>
                    <div className = 'title GB px20'>
                    컨텐츠 요약
                    </div>
                    <div className = 'summary GB px16 line35'>
                    {content?.detail.summary.split('\n').map((summary_line) => 
                        <div>{summary_line}</div>
                    )}
                    </div>
                </div>
            </div>
            {content.question !== -1 && <div className = 'block contentpage'>
                <div className = 'contentquestion margin_large'>
                    <div className = 'title GB px20'>
                    메멘토 질문
                    </div>
                    <ContentQuestion additionalClass = {type} content = {content} />
                </div>
            </div>}
            <ContentBorder content = {content}/>
            <div className = 'block contentpage overflow_hidden'style = {{paddingTop: '115px', paddingBottom: '150px'}}>
                <div className = 'more_content margin_base'>
                    <div className = 'background' />
                    <div className = 'title GB px20'>
                    연관 컨텐츠
                    </div>
                    <div className = 'content_container'>
                        {more_contents?.map((content) =>
                        <Contentbox additionalClass = 'small wide' content = {content}/>)}
                    </div>
                    {more_contents_count !== maxContentId && <div className = 'more_border' onClick = {() => {setMore_contents_count(Math.min(more_contents_count + 6, maxContentId))}}>
                        <div className = 'GB px18 bold op5'>더보기</div>
                        <img alt = "" className = 'more_button' src = {imageUrl('ContentPage/more_button.png')} />
                    </div>}
                </div>
            </div>
            <Footer additionalClass = ''/>
        </>
        )
    }, [content, title, tag, type, more_contents_count, maxContentId, more_contents]);
    
    return (
        <>
        {ContentPageHtml}
        </>
    );
}

export default ContentPage;
