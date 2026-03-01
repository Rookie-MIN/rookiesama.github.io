---
title: ABC 447 F - Centipede Graph
published: 2026-03-01
pinned: false
description: ABC 447 F
tags:
  - 树形dp
category: 题解
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-03-01
pubDate: 2026-03-01
---
## [F - Centipede Graph](https://atcoder.jp/contests/abc447/tasks/abc447_f)
### 题目大意：
- 给你一颗树形结构的图, 现在让你找出满足 和 蜈蚣一样的最长长度
![图表](https://img.atcoder.jp/abc447/574f669df50f1e1b96042142eef82ae9.png)


### 解题思路：
- 通过观察可以发现： 蜈蚣的躯干是由以下组成的:
	- 头，尾巴：连接三个顶点
	- 身体： 连接四个顶点
- 我们只需要查找 身体 + 头尾 的最长组合就行了
- 要求 3 $\leq$ 头 ，4 $\leq$ 身体;
- $du[u]$ 表示 u 点的度数
- 我们用 $dp[u]$ 表示 **以 u 为端点** 满足躯干度数要求的**最长路径的节点数**
	- 1. 如果 $du[u] \leq 2$ 无法成为节点 直接排除 $dp[u] = 0$
	- 1. 如果 $du[u] == 3$ 那么节点u 只能作为端点 $dp[u] = 1$(仅自己作为端点)
		- 答案更新： 如果 child 非空，则可连接在子路径后$ans = max(ans,child[0] + 1)$
		- 否则单独成路径 $ans = max(ans, 1)$
	- 2. 如果 $du[u] \geq 4$ 那么节点 u 能作为端点 或者 中间节点
		- 2.1: 如果 u 作为中间节点，则取子节点中最长的两条路径拼接，要求$child.size() \geq 2$ , $ans = max(ans,1 + child[0] + child[1])$ 
		- 2.2: 如果 u 作为端点, 那么只能拼接子树中最长路径，同时$dp[u] = max(dp[u],1 + child[0])$ 
		- 2.3: 自己单独作为路径： $ans = max(ans, 1)$
- 最后返回 $dp[u]$ (以 u 点作为最长的链)
- 答案就是 $ans$

### 易错点：
- 本题可能很难直接通过查找最长路径解决题目，可能会省略一些路径（其实我没找到反例，前面也是用该方法一直wa）
#### 错误代码样例：
- 直接通过查找最长能够实现的路径，特殊判断两个端点（不知道为啥wa，有机会取对拍一下）
```cpp
#include <bits/stdc++.h>
using namespace std;

using PII = pair<int, int>;
#define int long long
#define IOS ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
const int N = 2e5 + 10, mod = 998244353;

int n, m;
int du[N];// 无向图度
int h[N], e[N * 2], ne[N * 2], idx;
int st[N], core[N]; // core 用于判断是否是核心点
int max_dist, far_node;
vector<int> p;

void init(){
    idx = 0;
    max_dist = 0, far_node = 0;
    for(int i = 0; i <= n; i++) {
        h[i] = -1;
        du[i] = 0;
        st[i] = 0;
        core[i] = 0;
    }
}

void add(int a, int b){
    e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

void dfs(int u, int fa, int dist){
    st[u] = 1;
    p.push_back(u);
    if(dist > max_dist){
        max_dist = dist;
        far_node = u;
    }
    for(int i = h[u]; ~i; i = ne[i]){
        int j = e[i];
        if(j != fa && core[j]){
            dfs(j, u, dist + 1);
        } 
    }
}

int check(int u){
    for(int i = h[u]; ~i; i = ne[i]){
        if(du[e[i]] == 3){
            return 1;
        }
    }
    return 0;
}

void solve(){
    cin >> n;
    init();
    vector<PII> edges;
    for(int i = 1; i < n; i++){
        int u, v;
        cin >> u >> v;
        add(u, v), add(v, u);
        du[u]++, du[v]++;
        edges.push_back({u, v});
    }

    int ans = 1;
    
    for(auto& i: edges){// 处理 只有两个点的情况
        int u = i.first, v = i.second;
        if(du[u] >= 3 && du[v] >= 3){
            ans = 2;
            break;
        }
    }

    // 处理核心点
    for(int i = 1; i <= n; i++){
        if(du[i] >= 4) core[i] = 1;
    }

    for(int i = 1; i <= n; i++){
        if(core[i] && !st[i]){
            p.clear();
            max_dist = 0;
            far_node = i;
            dfs(i, -1, 0);
            for(auto& j : p) st[j] = 0;
            int u = far_node;
            max_dist = 0;
            //for(int j = 1; j <= n; j ++) st[j] = 0;
            dfs(u, -1, 0);
            int v = far_node;
            int add = 1;
            if(check(u)) add++;
            if(u != v && check(v)) add++;
            if(u == v){
                int t = 0;
                for(int i = h[u]; ~i; i = ne[i]){
                    if(du[e[i]] == 3){
                        t++;
                    }
                }
                if(t >= 2) add++;
            }
            ans = max(ans, max_dist + add);
        }
    }

    cout << ans << endl;
}

signed main(){
    IOS;
    int _ = 1;
    cin >> _;
    while(_--){
        solve();
    }
} 
```
### 代码：
```cpp
#include <bits/stdc++.h>
using namespace std;

using PII = pair<int, int>;
#define int long long
#define IOS ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
const int N = 2e5 + 10, mod = 998244353;

int n, m, ans;
int du[N];// 无向图度
int h[N], e[N * 2], ne[N * 2], idx;
vector<int> p;

void init(){
    idx = 0;
    ans = 1;
    for(int i = 0; i <= n; i++) {
        h[i] = -1;
        du[i] = 0;
    }
}

void add(int a, int b){
    e[idx] = b, ne[idx] = h[a], h[a] = idx++;
}

int dfs(int u, int fa){
    vector<int> child;
    for(int i = h[u]; ~i; i = ne[i]){
        int v = e[i];
        if(v == fa) continue;
        int val = dfs(v, u);
        if(val > 0) child.push_back(val);
    }

    // 从大到小排序
    sort(child.rbegin(), child.rend());

    int dp_u = 0;
    if(du[u] >= 4){
        // 可以作为中间节点或者端点 
        dp_u = 1; //自己作为端点
        if(!child.empty()){
            dp_u = max(dp_u, 1 + child[0]); //该节点
            ans = max(ans, 1 + child[0]);
        }
        // 作为中间节点
        if(child.size() >= 2){
            ans = max(ans, 1 + child[0] + child[1]);
        }
    }else if(du[u] == 3){
        // 只能作为端点
        dp_u = 1;
        if(!child.empty()){
            ans = max(ans, 1 + child[0]);
        }
        ans = max(ans, 1LL);
    }
    return dp_u;

}

void solve(){
    cin >> n;
    init();
    for(int i = 1; i < n; i++){
        int u, v;
        cin >> u >> v;
        add(u, v), add(v, u);
        du[u]++, du[v]++;
    }

    dfs(1, -1);
    cout << ans << endl;
}

signed main(){
    IOS;
    int _ = 1;
    cin >> _;
    while(_--){
        solve();
    }
}
```