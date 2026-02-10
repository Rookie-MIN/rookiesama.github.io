---
title: AtCoder Beginner Contest 443
published: 2026-02-01
pinned: false
description: AtCoder Beginner Contest 443 C~F
tags:
  - 题解
category: 题解
licenseName: CC BY
author: Rookiesama
draft: false
date: 2026-02-01
pubDate: 2026-02-01
---
## C:Chokutter Addiction

### 题目大意：
- 你可以打开电脑摸鱼，但你的同事会关掉你的电脑，并且你将在关掉电脑后的100分钟内不会再次打开电脑，问你摸鱼的总时间。

### 思路：
- 很明显，本题是模拟题，需要遍历模拟 同事来关电脑，若从关电脑的那一刻起到下一次查岗的时间相差 100 分钟以上，则会摸鱼，遍历所有 $a_i$ 最近一次减去关电脑时间即可
### 易错点：
- 需要特别注意，从0分钟开始是默认打开电脑的（如果只靠 $a_i$ 判断需要特别加上该时间）
- 计算最后一段时间， 即从 $a_n$~$m$的时间
```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
#define IOS ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
const int N = 3e5 + 10;

int n, m;
int a[N];

void solve(){
    cin >> n >> m;
    for(int i = 1; i <= n; i++) cin >> a[i];
    sort(a + 1, a + 1 + n);
    int flag = 1, now = 0, sum = 0;
    for(int i = 1; i <= n; i++){
        if(flag){
            sum += a[i] - now;
            flag = 0;
            now = a[i];
        }else{
            if(a[i] - now >= 100){
                sum += a[i] - now - 100;
                now = a[i];
            }
        }
    }
    if(flag){
        cout << m << endl;
        return;
    }
    if(m - now >= 100){
        sum += m - now - (flag? 0 : 100);        
    }
    cout << sum << endl;
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


## D: Pawn Line

### 题目大意:
- 一个 $n * n$ 大小的棋盘，每一列都有一个棋子， 你可以让棋子向上走（不能向下）现在问你用最少的步数，让 相邻的棋子距离最多为 1 即 $|a_i - a_{i+1}|==1$

### 理解：
- 现在要求所有点都要相邻，并且只能往上，那么一定是找最小的高度点，他决定了其他点的位置
	- 比如：有一个在第一行，那么旁边两个点最远也只能在第二行
	- 因此，当前前的 点移动的最小数就是，左右两边行数最小的值 - 自己所在的行数 - 两点列之差
	- $a_i - min(l_i,r_i)-abs(j-i)$ 
- 最后把所有点全部加起来即可

### 代码:

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
#define IOS ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
const int N = 3e5 + 10;

using PII = pair<int,int>;

int n, m;
int a[N], l[N], r[N];

void init(){
    for(int i = 1; i <= n; i++) l[i] = r[i] = 0;
}

void solve(){
    cin >> n;
    init();                          

    for(int i = 1; i <= n; i++) cin >> a[i];
    l[1] = a[1], r[n] = a[n];
    for(int i = 2; i <= n; i++){
        l[i] = min(a[i], l[i - 1] + 1);
    }
    for(int i = n - 1; i >= 1; i--){
        r[i] = min(a[i], r[i + 1] + 1);
    }
    int ans = 0;
    for(int i = 1; i <= n; i++){
        int cur = min(l[i], r[i]);
        ans += (a[i] - cur);
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


## E:Climbing Silver

### 题目大意:
- $N*N$的地图，你从 $(N,C)$ 出发，要求到达 $(1,j)$ 的点,若能到达，则$s_j=1$否则为$s_j=0$ 
- 你能够往左上方，右上方或者上方走。如果存在墙壁，且该列中除了这行以外的所有行都是能走的地方，就可以撞破该墙壁
	- 即：$g[i][j+1,N]=='.'$  就能撞破 $g[i][j]$ 的墙壁,且变为能够走的单元格
- 让你输出 $s_{1-N}$
### 理解:
-  其实就是类似于 bfs 走迷宫的题目，但本题有一个状态转移的问题
	- 如果当前墙壁能被破坏，则当前列所有墙壁都能被破坏。
	- 如果无法破坏，则保留无法破坏的规则，往后的所有也都无法破坏
	- 最后只要暴力模拟所有情况即可，找到能走到 $g[1][j]$ 的所有点
### 代码：
```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
#define IOS ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
const int N = 3e3 + 10;

using PII = pair<int,int>;

class Point{
public:
    int x, y, dis;
};

int n, m;
char g[N][N];
int f[N][N]; //当前点是否能够直接破坏
int st[N][N];


void bfs(){
    st[n][m] = 1;
    for(int i = n; i >= 1; i--){
        for(int j = 1; j <= n; j++){
            if(g[i][j] == '#') {
                f[i][j] = 1;
            }
            f[i - 1][j] = f[i][j];
        }
    }

    for(int i = n; i > 1; i--){ //从第 n 遍历
        for(int j = 1; j <= n; j++){// j 列
            
            if(st[i][j] == 1){
                int dy[3] = {0, 1, -1};
                int dx[3] = {-1, -1, -1};
                for(int k = 0; k < 3; k++){
                    int x = i + dx[k], y = j + dy[k];
                    if(x >= 1 && x <= n && y >= 1 && y <= n && (g[x][y] == '.' || f[x + 1][y] == 0)){
                        st[x][y] = 1;
                        f[x][y] = f[x + 1][y];
                    }
                }
            }
        }
    }
    for(int j = 1; j <= n; j++)
    {
        if(st[1][j] == 1) cout << "1" ;
        else cout << "0" ;
    }
    cout << endl;
}

void init(){
    for(int i = 1; i <= n; i++){
        for(int j = 1; j <= n; j++){
            f[i][j] = 0;
            st[i][j] = 0;
        }
    }
}

void solve(){
    cin >> n >> m;

    init();

    for(int i = 1; i <= n; i++)
        for(int j = 1; j <= n; j++)
            cin >> g[i][j];

    bfs();
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


### F: Non-Increasing Number

### 题目大意：
- 让你找出最小的数字 m ,满足 m 是 n 的倍数 且m的十进制位数 前面小于等于后面
	- 例如: 11223359 属于好数字
	- 21 -> 126

### 题目理解：
- 本题入手比较麻烦：若是想不到用bfs 暴力查找则很难找到答案。
- 需要对取模有一定理解:
	-  (A + B) % C == A % C + B % C;
	- 由此我们可以得出，其实就是对一个数不断取模，再加一个数使得该数能够被整除
	- 比如 (A + B) % C = D -> (D + E) % C = F .... 直到等于 0 （或者没有答案)
	- 只需要从第一位 开始查找， 遍历所有位上的数字即可（同时满足 $a_i\leq a_{i+1}$ )
- 如果通过bfs 找到过 该数字 则说明当前数字没有答案
### 代码:

```cpp
#include <bits/stdc++.h>
using namespace std;

#define int long long
#define IOS ios::sync_with_stdio(false), cin.tie(0), cout.tie(0);
const int N = 3e7 + 10;

int n, m;
int mp[N];

void solve()
{
    cin >> n;
    queue<int> q;
    // 枚举第一位的数字
    for (int d = 1; d <= 9; d++)
    {
        int r = d % n;
        int id = r * 10 + d; // 要存储的二位数字
        if (!mp[id])
        {
            mp[id] = -1;
            if (r == 0)
            {
                cout << d << endl;
                return;
            }
            q.push(id);
        }
    }

    int flag = 0; // 表示当前找不到
    while (!q.empty())
    {
        int u = q.front();
        q.pop();
        int d = u % 10; // 余数
        int r = u / 10; // 改变第个位的数
        for (int i = d; i <= 9; i++)
        {
            int nr = (r * 10 + i) % n; //不断模拟取余的过程 直到找到余数为0
            int nid = nr * 10 + i;
            if(!mp[nid]){
                mp[nid] = u;
                if(nr == 0){
                    flag = nid;
                    break;
                }
                q.push(nid);
            }
            
        }
        if(flag) break;
    }
    
    if(!flag){
        cout << -1 << endl;
        return;
    }
    
    //回溯数字 ，每次只取最后一位
    vector<int> ans;
    int cur = flag;
    while(cur != -1){
        ans.push_back(cur % 10);
        cur = mp[cur];
    }
    reverse(ans.begin(), ans.end()); //反转 ，ans最开始得到的是从后往前的数字
    for(int i = 0; i < ans.size(); i++)
        cout << ans[i];
    cout << endl;
}

signed main()
{
    IOS;
    int _ = 1;
    // cin >> _;
    while (_--)
    {
        solve();
    }
}
```
### 注意点：
- 我采取的方法是，不断取余，用 **余数 * 10 + i** 成为新的值
- 如果 $mp[nid]==1$表示已经查找过了，说明这种情况没有答案
- 由于我们是通过添加最后一位，让当前值能够被整除，因此，所得到的ans是反向的，即从最小到最大。
- 反转 ans 就是我们的答案