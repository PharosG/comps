import './Cascader.css';
import React from 'react';
//TODO ①多选的item样式改变（用函数？）、pPath在不需要的地方尽量省略(需要实时更新，因为item渲染时需要)；②选项的取消；③不限，num[]指定第几级不限
class Cascader extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            cols: 1,  //当前展示层级。从1计
            pPath: [],     //当前选中路径列表（index）
            vPath: [],     //当前选中路径列表（value）
            vRes: []     //最终勾选的结果列表（value）
        };
    }
    //（0-1）改变路径函数------------------------------------
     rePath(depth, pPath, vPath, pos, itemVal){
         while(pPath.length >= depth){  //修改当前路径（pop直到当前层级）
             pPath.pop();
             vPath.pop();
         }
         pPath.push(pos);
         vPath.push(itemVal);
     }
    //（1）展开函数---------------------------------------------------------------
    extendTo(depth, pos, itemVal){    //当前项的层级,位置,value，
        let {cols} = this.state;
        const { pPath, vPath } = this.state;
        this.rePath(depth, pPath, vPath, pos, itemVal);
        cols = depth + 1;
        this.setState({
            cols,
            pPath,
            vPath
        });
        console.log(pPath)
    };
    //（2）选择函数---------------------------------------------------------------
    selectWith(depth, pos, itemVal){
        const {pPath, vPath, vRes} = this.state;
        const {mod} = this.props;
        console.log(mod);
        //①单选模式******************
        if(mod === 'single'){
            this.rePath(depth, pPath, vPath, pos, itemVal);
            while(vRes.length)  vRes.pop();  //清空res，压入此项
            vRes.push(vPath.slice());
        }
        //②多选模式******************
        else if(mod === 'multiple'){
            this.rePath(depth, pPath, vPath, pos, itemVal);
            if(vRes.length){
                if(vPath[vPath.length - 2] !== vRes[0][vRes[0].length - 2]){    //和res里的叶子不是兄弟: 清空res
                    while(vRes.length)  vRes.pop();
                }
            }
            vRes.push(vPath.slice());  //∵仅存储字符串类型，∴可浅拷贝
        }
        //③跨级模式*****************
        // else if(mod === 'over'){
        //
        // }
        //〇默认模式
        //else{}
        this.setState({
            pPath,
            vPath,
            vRes
        })
        console.log(pPath)
        console.log(vPath)
        console.log(vRes)
    }

    render() {
        const {cols, pPath, vPath} = this.state;
        // const cols = new Array(this.max).fill('');
        const data = [
            {
                value: '0',
                label: '瀛洲',
                children: [
                    {
                        value: '0-0',
                        label: '沧浪',
                        children: [
                            {
                                value: '0-0-0',
                                label: '叶洲'
                            },
                            {
                                value: '0-0-1',
                                label: '月浮'
                            },
                            {
                                value: '0-0-2',
                                label: '鲛珠'
                            }
                        ]
                    },
                    {
                        value: '0-1',
                        label: '云梦泽',
                        children: [
                            {
                                value: '0-1-0',
                                label: '桃花潭'
                            },
                            {
                                value: '0-1-1',
                                label: '谢碧林'
                            },
                            {
                                value: '0-1-2',
                                label: '流川池'
                            }
                        ]
                    }
                ]
            },
            {
                value: '1',
                label: '幽都',
                children: [
                    {
                        value: '1-0',
                        label: '清墟',
                        children: [
                            {
                            value: '1-0-0',
                            label: '坐忘台'
                            }
                        ]
                    },
                    {
                        value: '1-1',
                        label: '龙潜处'
                    }
                ]
            },
        ];
        return (
            <div className="cscd-wrap">
                {/*第1层-----------*/}
                <div className={`list ${cols === 1 ? 'ls-blank' : cols === 2 ? 'ls-light' : 'ls-dark'}`}>
                    {data && data.map((item, index) => (
                        <div className={`item ${index !== pPath[0] ? '' : cols > 2 ? 'item-light' : 'item-blank'}`} key={index}
                             onClick={() =>
                                 this.extendTo(1, index, item.value)}
                        >
                            <div className="label">{item.label}</div>
                        </div>
                    ))}
                </div>
                {/*第2层------------*/}
                <div className={`list ${cols === 2 ? 'ls-blank' : cols === 3 ? 'ls-light' : ''}`}>
                    { pPath.length > 0 && data[pPath[0]].hasOwnProperty('children')
                        && (data[pPath[0]].children
                        ).map((item, index) => (
                        <div className={`item ${index !== pPath[1] ? '' : 'item-blank'}`} key={index}
                             onClick={item.children? () =>
                                  this.extendTo(2, index, item.value)
                                 : () => this.selectWith(2, index, item.value)}
                        >
                            <div className="label">{item.label}</div>
                            <div className={`${item.children ? '' : 'select'} ${index === pPath[1] ? 'selected' : ''}`}></div>
                        </div>
                    ))}
                </div>
                {/*第3层-----------*/}
                <div className={`list ${cols === 3 ? 'ls-blank' : ''}`}>
                    { pPath.length > 1 && data[pPath[0]].children[pPath[1]].hasOwnProperty('children')
                        && (
                            data[pPath[0]].children[pPath[1]].children
                        ).map((item, index) => (
                        <div className={`item ${index !== pPath[2] ? '' : 'item-blank'}`} key={index}
                             onClick={() => this.selectWith(3, index, item.value)}
                        >
                            <div className="label">{item.label}</div>
                            <div className={`select ${index === pPath[2] ? 'selected' : ''}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Cascader;


{/*{cols.map((v,index) => (*/}
{/*    <div className={`list list-${index}`} key={index}>*/}
{/*        {data.map((v, index) => (*/}
{/*            <div className="item" key={index}*/}
{/*                 onClick={() => this.extendTo(v.value)}>*/}
{/*                {v.label}*/}
{/*            </div>*/}
{/*        ))}*/}
{/*    </div>*/}
{/*    ))}*/}

