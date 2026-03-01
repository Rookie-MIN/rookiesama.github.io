---
title: AtCoder Beginner Contest 447CD
published: 2026-03-01
pinned: false
description: AtCoder Beginner Contest 447
tags:
  - 题解
  - ABC
category: 题解
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-03-01
pubDate: 2026-03-01
---
## [C:Chokutter Addiction](https://atcoder.jp/contests/abc447/tasks/abc447_c)

### 题目大意：
- 给你两个字符串，让你将字符串 S 修改成 字符串 T，问你最少的改动次数，要求如下：
	- 1.只能在S中删除或添加字母 'A' 

### 思路：
- 很明显，如果只能对一个字母 ‘A’ 进行操作，那么只有一个解：
	- 要么有解，要么无解
- 我们只需要从头开始匹配，让两个字符串能够匹配成功即可（缺少A提供，多A删除)
### 代码：
```cpp
#include <bits/stdc++.h>
using namespace std;

using PII = pair<int, int>;
#define int long long
#define IOS ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
const int N = 5e5 + 10;

int n, m;

void solve(){
    string s, t;
    cin >> s >> t;
    n = s.size();
    m = t.size();
    s = " " + s, t = " " + t;
    int i = 1, j = 1;
    int cnt = 0;
    while(i <= n || j <= m){
        if(i <= n && j <= m && s[i] == t[j]){
            i++, j++;
            continue;
        }
        // 删除操作
        if(i <= n && s[i] == 'A'){
            i++;
            cnt++;
        } else if(j <= m && t[j] == 'A'){ // 添加
            j++;
            cnt++;
        }else{ // 两种操作都不行
            cout << -1 << endl;
            return;
        }

    }
    cout << cnt << endl; 
}

signed main(){
    IOS;
    int _ = 1;
    //cin >> _;
    while(_--){
        solve();
    }
}
```


## [D - Take ABC 2]([D - Take ABC 2](https://atcoder.jp/contests/abc447/tasks/abc447_d))

### 题目大意：
- 给你一个字符串 S 让你选择元组 $(i, j, k)$ 满足 $1 \leq i < j < k \leq |S|$ ，并且$s[i] = 'A',s[j] = 'B', s[k] = 'C'$ ，问你最多能删除多少组。
### 解题思路：
- 由于 一定满足 $i < j < k$ 并且所选定的字母固定，如果从前往后判定是否能出现 ’ABC' 元组:
	- 第i个字母是 'A'  可以直接添加 拥有 'A'
	- 第i个字母是 'B' 只有 A 的数量 > B 的数量才能够凑成 'AB' 元组
	- 第i个字母是 'C' 只有 B 的数量 > C 的数量才能够组成 'BC' 元组
- 最后 C 能成立的数量就是答案

### 代码：
- 我这里写的是从 后往前去判定:
```cpp
#include <bits/stdc++.h>
using namespace std;

using PII = pair<int, int>;
#define int long long
#define IOS ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
const int N = 5e5 + 10;

int n, m;


void solve(){
    string s;
    cin >> s;
    n = s.size();
    s = " " + s;
    int a = 0, b = 0, c = 0;
    for(int i = n; i >= 1; i--){
        if(s[i] == 'C') c++;
        else if(s[i] == 'B' && c > b) b++;
        else if(s[i] == 'A' && b > a) a++;
    }
    cout << a << endl;
}

signed main(){
    IOS;
    int _ = 1;
    //cin >> _;
    while(_--){
        solve();
    }
}
```