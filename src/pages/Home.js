import Menu from '../components/Menu';

function Home() {
    const list = [
        {id: 1, title: '첫 번째 게시물', content: '첫 번째 게시물입니다.'},
        {id: 2, title: '두 번째 게시물', content: '두 번째 게시물입니다.'},
        {id: 3, title: '세 번째 게시물', content: '세 번째 게시물입니다.'},
        {id: 1, title: '첫 번째 게시물', content: '첫 번째 게시물입니다.'},
        {id: 2, title: '두 번째 게시물', content: '두 번째 게시물입니다.'},
        {id: 3, title: '세 번째 게시물', content: '세 번째 게시물입니다.'},
        {id: 1, title: '첫 번째 게시물', content: '첫 번째 게시물입니다.'},
        {id: 2, title: '두 번째 게시물', content: '두 번째 게시물입니다.'},
        {id: 3, title: '세 번째 게시물', content: '세 번째 게시물입니다.'},
    ];

    return (
        <div>
            <h1 className="text-center my-5">홈!!!</h1>
            <div className="row">
                {list.map(item=>(
                    <div className="col-sm-6 col-md-4 col-lg-3" key={item.id}>
                        <Menu title={item.title} content={item.content} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home;