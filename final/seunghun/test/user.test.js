const {Update, Delete, Info, getPost, writeComment,updateComment,deleteComment} = require('../controllers/user');
jest.mock('../models/user');


describe('Update', () =>{
    const req = {
        user:{
            id: '11',
        },
        body:{
            password: '1024',
            nickName: 'seungh',
        }
    };
    const res = {
        status: jest.fn(() =>res),
        send: jest.fn(),
    };
    const next = jest.fn();

    test('사용자를 찾아 비밀번호,닉네임 등을 업데이트하고 수정 완료 응답함', async() =>{
        await Update(req,res,next);
        expect(res.send).toBeCalledWith('수정 완료');
    });

});