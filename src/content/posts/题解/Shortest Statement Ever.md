---
title: Shortest Statement Ever
published: 2026-01-31
pinned: false
description: codeforceDiv2 1077 D 一道数位dp
tags:
  - 题解
category: 数位DP
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-01-31
pubDate: 2026-01-31
---
## [原题链接]([Problem - D - Codeforces](https://codeforces.com/contest/2188/problem/D))

##  **问题理解与转化**

## 1.题目概述
- 题目：给你 x 和 y，让你找出两个非负整数 p 和 q，满足 $p \& q = 0$ 且 $|x - q| + |y - p|$ 最小


**输入**：
```
7
0 0
1 1
3 6
7 11
4 4
123 321
1073741823 1073741822
```


**输出**：
```
0 0
2 1
3 8
6 9
4 3
128 321
1073741824 1073741822
```


**关键约束**：数据量在 $10^4$左右，无法通过直接暴力计算算出可能的答案
## 2. **核心思路阐述**
### 解题思路
- 很明显，本题是用的是数位运算的办法，通过拆分每一位的值，通过 -1 或者 -0的操作，模拟相减的情况，使得 $p \& q = 0$ 且 $|x - q| + |y - p|$ 
- 由于情况复杂多样，我们**无法通过贪心的方法**解决该问题，只有用动态dp的方法去解决该问题
- $A - B$只有三种情况
	- 大于 等于 小于
- 可以考虑直接暴力查找这 3 种情况，再去暴力遍历 p , q 在第 i 位是1还是 0  (满足不同时为 1 即可)
- 状态表示:
	- 我们设立 $f[i][state_q][state_p]$ 表示 计算到第 i 位，q 的状态是 $state_q$ 和 p的状态是 $state_p$ 所得到的最小值
- 状态转移:
	- $f[i][newstate_q][newstate_p] = min(f[i][newstate_q][newstate_p],f[i+1][state_q][state_p]+cost)$
### 关键观察
- 若计算到第 $i + 2$位时，x 和 p 相等， $i + 1$ 中 $p>x$ 则 p一定大于x 无论后续 p 有多少个小于 x
	- 比如： $12 = 1100 , 11 = 1011 , 第二位  1 > 0 故 12 > 11$ 


## 3. **详细算法设计**

### 算法步骤
- 先将 f 数组初始化为 INF ，只有 $f[31][1][1]=0$表示所有情况都是从 该状态转移来的。
- 暴力拆解 p 和 x , q 和 y的关系 0 1 2 
	- = 1 ： 需要判断当前点情况 与 x 的情况 ，若 $P_i > X_i-> = 0 ,P_i<X_i->=2$ 
	- = 0 ： 保持等于 0 $(p_i - x_i)*2^i$ 
	- = 2 ： 保持等于 2 $(x_i - p_i)*2^i$ 
- $f[i][state_q][state_p] \not= INF$ 证明存在该情况 可以计算
- 由于题目要求计算出 原来的 p 和 q， 因此我们得通过得到的 最小$f[0][state_q][state_p]$ 进行回推
- 我们还得存储每一次状态转移的 $state$ 和 $p_i,q_i$ 
- 由于我们得到的是 第 0 位，得从 0 推向 31 位 故要存储 $pre_{st}[i][newstate_q][newstate_p]=pre_{st}[i+1][state_q][state_p]$
- 同理再存储 $p_i,q_i$的值，最后逆向回溯当前值即可
## 4. **正确性证明**

### 正确性证明
- 我们用动态规划的方法计算了所有可能的情况，并按照最小来转移
- 因此一定存在我们想要的答案
## 5. **复杂度分析**

### 复杂度分析
-  时间复杂度 : $O(100t)$
-  空间复杂度 : $O(100)$

## 6. **代码实现**
``` cpp
#include <bits/stdc++.h>
using namespace std;
#define int long long
using PII = pair<int,int>;

const int N = 2e5 + 10,INF = 1e18;

int f[33][3][3]; // 表示 第 i 位 p 与 x 的大小比较 q 与 x 的大小比较
PII pre_st[33][3][3], coi[33][3][3];
// 0 p > x 1 p = x 2 p < x
void solve(){
    int x, y;
    cin >> x >> y;
	//初始化
    for (int i = 0; i <= 31; ++i)
        for (int j = 0; j < 3; ++j)
            for (int k = 0; k < 3; ++k)
                f[i][j][k] = INF;

    f[31][1][1] = 0;
	//数位dp过程
    for(int i = 30; i >= 0; i--){
        int xi = (x >> i) & 1;
        int yi = (y >> i) & 1;
        for(int stp = 0; stp < 3; stp++){
            for(int stq = 0; stq < 3; stq++){
                if(f[i + 1][stp][stq] == INF) continue;
                for(int p = 0; p < 2 ;p++){
                    for(int q = 0; q < 2; q++){
                        if(p & q == 1) continue;
                        int nstp = stp;
                        if(nstp == 1){
                            if(p > xi) nstp = 0;
                            else if(p < xi) nstp = 2;
                        }
                        int nstq = stq;
                        if(nstq == 1){
                            if(q > yi) nstq = 0;
                            else if(q < yi) nstq = 2;
                        }
                        int t = 0;
						//计算 当 p 与 x 的大小关系 为 nstp 时的代价
                        if(nstp == 0){
                            t += (p - xi) << i;
                        }else if(nstp == 2){
                            t += (xi - p) << i;
                        }
						//计算 当 q 与 x 的大小关系 为 nstq 时的代价
                        if(nstq == 0){
                            t += (q - yi) << i;
                        }else if(nstq == 2){
                            t += (yi - q) << i;
                        }
						//更新 当 p 与 x 的大小关系 为 nstp 且 q 与 x 的大小关系 为 nstq 时的最小代价
                        if(f[i + 1][stp][stq] + t < f[i][nstp][nstq]){
                            f[i][nstp][nstq] = f[i + 1][stp][stq] + t;
                            pre_st[i][nstp][nstq] = {stp, stq};
                            coi[i][nstp][nstq] = {p, q};
                        }
                    }
                }
            }
        }

    }

    int mi = INF;
    int stp = -1, stq = -1;
    for(int j = 0; j < 3; j++){
        for(int k = 0; k < 3; k++){
            if(f[0][j][k] < mi){
                mi = f[0][j][k];
                stp = j;
                stq = k;
            }
        }
    }
    //回推 p 和 q 的值
    int p = 0, q = 0;
    for(int i = 0; i <= 30; i++){
        int nstp = pre_st[i][stp][stq].first;
        int nstq = pre_st[i][stp][stq].second;
        p |= coi[i][stp][stq].first << i;
        q |= coi[i][stp][stq].second << i;
        stp = nstp;
        stq = nstq;
    }
    cout << p << " " << q << endl;
}

signed main(){
    ios::sync_with_stdio(0),cin.tie(0),cout.tie(0);
    int _ = 1;
    cin >> _;
    while(_--){
        solve();
    }
}
```



## 7. **拓展与变种**

### 相关题目


### 问题变种


### 实际应用



## 8. **总结与收获**

### 总结
- 本题最难的我认为还是，状态转移的表示，初见该类题目难以想到如何状态转移
### 核心知识点
- [数位DP]

### 思维模式
- 分析每一位的转移，找到最优的方案

### 学习建议
- 推荐多写写
