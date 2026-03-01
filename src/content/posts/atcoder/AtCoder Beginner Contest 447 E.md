---
title: AtCoder Beginner Contest 447 E
published: 2026-03-01
pinned: false
description: AtCoder Beginner Contest 447 E
tags:
  - ABC
  - 并查集
  - 贪心
category: 题解
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-03-01
pubDate: 2026-03-01
---
## [E - Divide Graph](https://atcoder.jp/contests/abc447/tasks/abc447_e)

### 题目大意：
- 现在给你 n 个点， m 条边， 现在让你删除一些边使得，这个图正有 2 条连通分量
	- 连通分量：如果从一个顶点，都存在路径到达另一个顶点，则顶点称为连通的。
- 现在让你求出，最小代价使得有 2 条连通分量。
### 解题思路
- 由于删除 第 i 条边的代价是： $2^i > 2^{i-1} + ... + 2^1$ ，所以，越是后面的边越是要保留，因此建图要从后面的边开始建
- 只有当 两个点 连接后 连通分量 $cnt - 1 < 2$ 时不能够连边
- 判断两个点连接后， 连通分量 cnt 是否会减少主要依据 是否在同一个集合中，这里我们用 [[并查集]] 去判断。

### 易错点：
- 注意要 mod 并且计算 $2^i$ 要用快速幂(qpow)

### 代码：
```cpp
#include <bits/stdc++.h>
using namespace std;

using PII = pair<int, int>;
#define int long long
#define IOS ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
const int N = 5e5 + 10, mod = 998244353;

int n, m;
class Node{
public:
    int u, v;
};
Node a[N];
int p[N];

int find(int x){
    if(p[x] != x) p[x] = find(p[x]);
    return p[x];
}

int qpow(int x, int k){
    int res = 1;
    while(k){
        if(k & 1) res = res * x % mod;
        x = x * x % mod;
        k >>= 1;
    }
    return res;
}

void solve(){
    cin >> n >> m;
    for(int i = 1; i <= n; i++) p[i] = i;
    for(int i = 1; i <= m; i++){
        cin >> a[i].u >> a[i].v;
    }
    
    int cnt = n, ans = 0;
    
    for(int i = m; i >= 1; i--){
        int u = a[i].u, v = a[i].v;
        if(find(u) != find(v)){
            if(cnt - 1 >= 2){
                p[find(u)] = find(v);
                cnt--;
            }else{
                ans = (ans + qpow(2, i)) % mod;
            }
        }
    }
    cout << ans << endl;
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