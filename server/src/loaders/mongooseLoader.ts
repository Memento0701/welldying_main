import { Application } from "express";
import mongoose, { model } from "mongoose";
import config from "../config";
import { userSchema, UserDocument } from "../models/user";
import { questionSchema } from "../models/question";
import { sectionSchema } from "../models/section";
import { contentSchema } from "../models/content";
import { answerSchema } from "../models/answer";
import { subscriberSchema } from "../models/subscriber";
import { noticeSchema } from "../models/notice";
import { newsSchema } from "../models/news";
import { qnaSchema } from "../models/qna";
import { commentSchema } from "../models/comment";
import { categorySchema } from '../models/category';
import { orderSchema } from "../models/order";
import { programAnswerSchema } from "../models/programAnswer";
import { communityUserSchema } from "../models/community/communityUser";
import { communityAnswerSchema } from "../models/community/communityAnswer";
import { communityCommentSchema } from "../models/community/communityComment";
import { communityQuestionSchema } from "../models/community/communityQuestion";
import { communityRecommentSchema } from "../models/community/communityRecomment";



const f = async (app: Application) => {
    await mongoose.connect(config.mongodbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    return {
        User: model('user', userSchema, 'users'),
        Question: model('question', questionSchema, 'questions'),
        Section: model('section', sectionSchema, 'sections'),
        Content: model('content', contentSchema, 'contents'),
        Answer: model('answer', answerSchema, 'answers'),
        Subscriber: model('subscriber', subscriberSchema, 'subscribers'),
        Notice: model('notice', noticeSchema, 'notices'),
        News: model('news', newsSchema, 'newss'),
        Qna: model('qna', qnaSchema, 'qnas'),
        Comment: model('comment', commentSchema, 'comments'),
        Category: model('category', categorySchema, 'categorys'),
        Order: model('order', orderSchema, 'orders'),
        ProgramAnswer: model('programAnswer', programAnswerSchema, 'programAnswers'),
        CommunityUser: model('communityUser', communityUserSchema, 'communityUsers'),
        CommunityAnswer: model('communityAnswer', communityAnswerSchema, 'communityAnswers'),
        CommunityComment: model('communityComment', communityCommentSchema, 'communityComments'),
        CommunityRecomment: model('communityRecomment', communityRecommentSchema, 'communityRecomments'),
        CommunityQuestion: model('communityQuestion', communityQuestionSchema, 'communityQuestions'),
    }
}

export default f;
type ThenArg<T> = T extends PromiseLike<infer U> ? U : T
export type ModelsType = ThenArg<ReturnType<typeof f> >;
