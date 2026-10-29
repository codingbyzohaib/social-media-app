import { useEffect, useState } from "react";
import {
  Home, Search, Compass, MessageCircle, Heart, PlusSquare,
  UserRound, MoreHorizontal, Image, Smile, Bookmark,
  Send, X, LogOut, Users, TrendingUp, Bell
} from "lucide-react";
import "./App.css";

const initialUsers = [
  { id: 1, name: "Sophia Williams", username: "sophia.jpg", avatar: "https://i.pravatar.cc/150?img=47", following: true },
  { id: 2, name: "James Wilson", username: "jameswilson", avatar: "https://i.pravatar.cc/150?img=12", following: false },
  { id: 3, name: "Olivia Martin", username: "oliviamartin", avatar: "https://i.pravatar.cc/150?img=44", following: true },
  { id: 4, name: "Noah Davis", username: "noahdavis", avatar: "https://i.pravatar.cc/150?img=11", following: false }
];

const initialPosts = [
  {
    id: 1, userId: 1, name: "Sophia Williams", username: "sophia.jpg",
    avatar: "https://i.pravatar.cc/150?img=47",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=900",
    caption: "Somewhere between the mountains and the sky, I found my peace. 🌿",
    likes: 1248, liked: false, saved: false, time: "2 hours ago",
    comments: [{ id: 1, username: "oliviamartin", text: "Absolutely beautiful! 😍" }]
  },
  {
    id: 2, userId: 2, name: "James Wilson", username: "jameswilson",
    avatar: "https://i.pravatar.cc/150?img=12",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=900",
    caption: "Ocean air, messy hair, and absolutely no plans. 🌊",
    likes: 856, liked: false, saved: false, time: "4 hours ago",
    comments: [{ id: 2, username: "sophia.jpg", text: "Need this kind of day!" }]
  },
  {
    id: 3, userId: 3, name: "Olivia Martin", username: "oliviamartin",
    avatar: "https://i.pravatar.cc/150?img=44",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900",
    caption: "Little things make the biggest difference. 🌸",
    likes: 2034, liked: false, saved: false, time: "Yesterday",
    comments: []
  }
];

const currentUser = {
  id: 99,
  name: "Zohaib Ahmed",
  username: "zohaib",
  avatar: "https://i.pravatar.cc/150?img=68"
};

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [posts, setPosts] = useState(() => readStorage("connectly_posts", initialPosts));
  const [users, setUsers] = useState(() => readStorage("connectly_users", initialUsers));
  const [activeTab, setActiveTab] = useState("For you");
  const [search, setSearch] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [notifications, setNotifications] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("connectly_posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("connectly_users", JSON.stringify(users));
  }, [users]);

  function notify(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  }

  function toggleLike(id) {
    setPosts(previous => previous.map(post =>
      post.id === id
        ? { ...post, liked: !post.liked, likes: post.likes + (post.liked ? -1 : 1) }
        : post
    ));
  }

  function toggleSave(id) {
    setPosts(previous => previous.map(post =>
      post.id === id ? { ...post, saved: !post.saved } : post
    ));
    notify("Saved posts updated");
  }

  function toggleFollow(id) {
    setUsers(previous => previous.map(user =>
      user.id === id ? { ...user, following: !user.following } : user
    ));
  }

  function addComment(id) {
    const text = (commentInputs[id] || "").trim();
    if (!text) return;

    setPosts(previous => previous.map(post =>
      post.id === id
        ? {
            ...post,
            comments: [...post.comments, {
              id: Date.now(),
              username: currentUser.username,
              text
            }]
          }
        : post
    ));

    setCommentInputs(previous => ({ ...previous, [id]: "" }));
  }

  function createPost(event) {
    event.preventDefault();

    if (!caption.trim() && !imageUrl.trim()) {
      notify("Add a caption or image first");
      return;
    }

    const newPost = {
      id: Date.now(),
      userId: currentUser.id,
      name: currentUser.name,
      username: currentUser.username,
      avatar: currentUser.avatar,
      image: imageUrl.trim(),
      caption: caption.trim(),
      likes: 0,
      liked: false,
      saved: false,
      time: "Just now",
      comments: []
    };

    setPosts(previous => [newPost, ...previous]);
    setCaption("");
    setImageUrl("");
    setShowCreate(false);
    setActiveTab("For you");
    notify("Your post is live!");
  }

  const visiblePosts = posts.filter(post => {
    const term = search.toLowerCase();
    const matchesSearch =
      post.name.toLowerCase().includes(term) ||
      post.username.toLowerCase().includes(term) ||
      post.caption.toLowerCase().includes(term);

    if (!matchesSearch) return false;
    if (activeTab === "Saved") return post.saved;
    if (activeTab === "Following") {
      return post.userId === currentUser.id ||
        users.some(user => user.id === post.userId && user.following);
    }
    return true;
  });

  function navClick(tab) {
    setActiveTab(tab);
    if (tab === "Create") setShowCreate(true);
    if (tab === "Notifications") setNotifications(!notifications);
    if (tab === "Profile") setProfileMenu(!profileMenu);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a href="#home" className="brand">
          <span className="brand-icon">c</span>
          <span>connectly<span className="brand-dot">.</span></span>
        </a>

        <div className="sidebar-profile">
          <img src={currentUser.avatar} alt="Profile" />
          <div>
            <strong>{currentUser.name}</strong>
            <span>@{currentUser.username}</span>
          </div>
          <MoreHorizontal size={20} />
        </div>

        <p className="menu-label">MENU</p>

        <nav className="main-nav">
          <button className={activeTab === "For you" ? "nav-item active" : "nav-item"} onClick={() => navClick("For you")}>
            <Home size={20} /> <span>Home Feed</span>
          </button>
          <button className="nav-item" onClick={() => document.getElementById("search-box")?.focus()}>
            <Search size={20} /> <span>Explore</span>
          </button>
          <button className={activeTab === "Following" ? "nav-item active" : "nav-item"} onClick={() => navClick("Following")}>
            <Users size={20} /> <span>Following</span>
          </button>
          <button className={activeTab === "Saved" ? "nav-item active" : "nav-item"} onClick={() => navClick("Saved")}>
            <Bookmark size={20} /> <span>Saved Posts</span>
          </button>
          <button className="nav-item" onClick={() => navClick("Notifications")}>
            <Bell size={20} /> <span>Notifications</span>
            <span className="notification-dot" />
          </button>
          <button className="nav-item" onClick={() => notify("Messaging coming soon!")}>
            <MessageCircle size={20} /> <span>Messages</span>
          </button>
        </nav>

        <button className="create-button" onClick={() => setShowCreate(true)}>
          <PlusSquare size={19} /> Create a post
        </button>

        <div className="sidebar-bottom">
          <div className="online-indicator" />
          <span>You're all caught up</span>
        </div>
      </aside>

      <main className="feed-area" id="home">
        <header className="topbar">
          <div className="mobile-brand">
            <span className="brand-icon">c</span> connectly<span className="brand-dot">.</span>
          </div>

          <div className="search-box">
            <Search size={19} />
            <input
              id="search-box"
              type="search"
              placeholder="Search people, posts..."
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
            {search && <button onClick={() => setSearch("")}><X size={16} /></button>}
          </div>

          <div className="topbar-actions">
            <button className="icon-button" aria-label="Notifications" onClick={() => setNotifications(!notifications)}>
              <Bell size={21} />
              <span className="notification-dot" />
            </button>
            <button className="top-avatar" onClick={() => setProfileMenu(!profileMenu)}>
              <img src={currentUser.avatar} alt="Your profile" />
            </button>
          </div>
        </header>

        {notifications && (
          <div className="floating-panel notification-panel">
            <strong>Notifications</strong>
            <p>You're all caught up! ✨</p>
            <button onClick={() => setNotifications(false)}>Close</button>
          </div>
        )}

        {profileMenu && (
          <div className="floating-panel profile-panel">
            <strong>{currentUser.name}</strong>
            <span>@{currentUser.username}</span>
            <button onClick={() => { setActiveTab("For you"); setProfileMenu(false); }}>
              <UserRound size={16} /> My feed
            </button>
            <button onClick={() => { localStorage.removeItem("connectly_posts"); localStorage.removeItem("connectly_users"); window.location.reload(); }}>
              <LogOut size={16} /> Reset demo
            </button>
          </div>
        )}

        <section className="welcome-section">
          <div>
            <span className="eyebrow">YOUR LITTLE CORNER OF THE INTERNET</span>
            <h1>Good things happen<br />when we <span>connect.</span></h1>
            <p>Discover stories, share moments, and stay close to your people.</p>
          </div>
          <div className="welcome-art">
            <div className="art-circle art-circle-one" />
            <div className="art-circle art-circle-two" />
            <img src="https://i.pravatar.cc/150?img=47" alt="" />
            <img src="https://i.pravatar.cc/150?img=12" alt="" />
            <img src="https://i.pravatar.cc/150?img=44" alt="" />
            <span>✦</span>
          </div>
        </section>

        <section className="stories-section">
          <div className="section-heading">
            <div>
              <h2>Your circles</h2>
              <p>A little update from your people</p>
            </div>
            <button className="text-button" onClick={() => notify("You're viewing all available stories")}>See all</button>
          </div>

          <div className="stories-list">
            <button className="story-item add-story" onClick={() => setShowCreate(true)}>
              <div className="story-ring add-ring">
                <img src={currentUser.avatar} alt="Your story" />
                <span>+</span>
              </div>
              <span>Your story</span>
            </button>

            {users.map(user => (
              <button className="story-item" key={user.id} onClick={() => { setSearch(user.username); setActiveTab("For you"); }}>
                <div className="story-ring">
                  <img src={user.avatar} alt={user.name} />
                </div>
                <span>{user.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="feed-section">
          <div className="section-heading feed-heading">
            <div>
              <h2>Your feed</h2>
              <p>Fresh moments from your community</p>
            </div>
            <select value={activeTab} onChange={event => setActiveTab(event.target.value)} aria-label="Feed filter">
              <option>For you</option>
              <option>Following</option>
              <option>Saved</option>
            </select>
          </div>

          <div className="quick-post">
            <img src={currentUser.avatar} alt="Your profile" />
            <button onClick={() => setShowCreate(true)}>What's on your mind, Zohaib?</button>
            <button className="quick-image" onClick={() => setShowCreate(true)} aria-label="Add photo"><Image size={21} /></button>
          </div>

          {visiblePosts.length === 0 ? (
            <div className="empty-state">
              <Compass size={35} />
              <h3>Nothing here just yet</h3>
              <p>Try another search or create the first post.</p>
              <button className="create-button" onClick={() => setShowCreate(true)}>Create a post</button>
            </div>
          ) : visiblePosts.map(post => (
            <article className="post-card" key={post.id}>
              <div className="post-header">
                <img className="post-avatar" src={post.avatar} alt={post.name} />
                <div className="post-user">
                  <strong>{post.name}</strong>
                  <span>@{post.username} · {post.time}</span>
                </div>
                <button className="more-button" aria-label="More options" onClick={() => toggleSave(post.id)}>
                  <MoreHorizontal size={22} />
                </button>
              </div>

              {post.caption && <p className="post-caption">{post.caption}</p>}
              {post.image && <img className="post-image" src={post.image} alt="Post" onError={event => { event.currentTarget.style.display = "none"; }} />}

              <div className="post-stats">
                <span><Heart size={15} fill="#ed667d" color="#ed667d" /> {post.likes.toLocaleString()} likes</span>
                <button onClick={() => setOpenComments(previous => ({ ...previous, [post.id]: !previous[post.id] }))}>
                  {post.comments.length} comments
                </button>
              </div>

              <div className="post-actions">
                <button className={post.liked ? "post-action liked" : "post-action"} onClick={() => toggleLike(post.id)}>
                  <Heart size={21} fill={post.liked ? "currentColor" : "none"} /> <span>Like</span>
                </button>
                <button className="post-action" onClick={() => setOpenComments(previous => ({ ...previous, [post.id]: !previous[post.id] }))}>
                  <MessageCircle size={21} /> <span>Comment</span>
                </button>
                <button className="post-action" onClick={() => { navigator.clipboard?.writeText(window.location.href); notify("Page link copied!"); }}>
                  <Send size={20} /> <span>Share</span>
                </button>
                <button className={post.saved ? "post-action saved" : "post-action"} onClick={() => toggleSave(post.id)} aria-label="Save post">
                  <Bookmark size={20} fill={post.saved ? "currentColor" : "none"} />
                </button>
              </div>

              {openComments[post.id] && (
                <div className="comments-area">
                  {post.comments.map(comment => (
                    <div className="comment-item" key={comment.id}>
                      <strong>@{comment.username}</strong>
                      <span>{comment.text}</span>
                    </div>
                  ))}
                  <form className="comment-form" onSubmit={event => { event.preventDefault(); addComment(post.id); }}>
                    <input
                      value={commentInputs[post.id] || ""}
                      onChange={event => setCommentInputs(previous => ({ ...previous, [post.id]: event.target.value }))}
                      placeholder="Write a comment..."
                    />
                    <button type="submit">Post</button>
                  </form>
                </div>
              )}
            </article>
          ))}
        </section>

        <footer className="page-footer">Made with care · Connectly © 2026</footer>
      </main>

      <aside className="right-sidebar">
        <div className="right-title">
          <div>
            <h2>Discover</h2>
            <p>Find your next connection</p>
          </div>
          <Compass size={22} />
        </div>

        <section className="suggestion-section">
          <div className="right-section-heading">
            <h3>People you may know</h3>
            <button onClick={() => notify("Showing suggested people")}>See all</button>
          </div>

          {users.map(user => (
            <div className="suggestion-user" key={user.id}>
              <img src={user.avatar} alt={user.name} />
              <div className="suggestion-info">
                <strong>{user.name}</strong>
                <span>@{user.username}</span>
              </div>
              <button className={user.following ? "follow-button following" : "follow-button"} onClick={() => toggleFollow(user.id)}>
                {user.following ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        </section>

        <section className="trending-section">
          <div className="right-section-heading">
            <h3><TrendingUp size={17} /> Trending today</h3>
          </div>
          {[
            ["#LittleThings", "2.4k posts"],
            ["#WeekendVibes", "1.8k posts"],
            ["#CreativeLife", "956 posts"]
          ].map(([tag, count]) => (
            <button className="trend-item" key={tag} onClick={() => setSearch(tag.replace("#", ""))}>
              <div><strong>{tag}</strong><span>{count}</span></div>
              <MoreHorizontal size={19} />
            </button>
          ))}
        </section>

        <div className="community-card">
          <div className="community-icon"><Smile size={23} /></div>
          <h3>Good vibes live here.</h3>
          <p>Share your story, celebrate others, and make someone's day.</p>
          <button onClick={() => setShowCreate(true)}>Share a moment <span>→</span></button>
        </div>

        <div className="right-footer">About · Privacy · Community Guidelines<br />© 2026 Connectly</div>
      </aside>

      {showCreate && (
        <div className="modal-overlay" onClick={() => setShowCreate(false)}>
          <form className="create-modal" onClick={event => event.stopPropagation()} onSubmit={createPost}>
            <div className="modal-heading">
              <h2>Create a post</h2>
              <button type="button" className="close-modal" onClick={() => setShowCreate(false)}><X size={21} /></button>
            </div>

            <div className="modal-user">
              <img src={currentUser.avatar} alt="Your profile" />
              <div><strong>{currentUser.name}</strong><span>Sharing with everyone</span></div>
            </div>

            <textarea
              autoFocus
              value={caption}
              onChange={event => setCaption(event.target.value)}
              placeholder="What would you like to share?"
              rows={5}
            />

            <label className="image-url-label"><Image size={19} /> Image URL</label>
            <input
              className="image-url-input"
              type="url"
              value={imageUrl}
              onChange={event => setImageUrl(event.target.value)}
              placeholder="https://example.com/photo.jpg"
            />

            <div className="modal-bottom">
              <span><Smile size={19} /> Make someone's day</span>
              <button className="publish-button" type="submit">Publish post <Send size={16} /></button>
            </div>
          </form>
        </div>
      )}

      {toast && <div className="toast-message">{toast}</div>}

      <nav className="mobile-nav">
        <button onClick={() => navClick("For you")}><Home size={22} /></button>
        <button onClick={() => document.getElementById("search-box")?.focus()}><Search size={22} /></button>
        <button onClick={() => setShowCreate(true)}><PlusSquare size={23} /></button>
        <button onClick={() => notify("You're all caught up!")}><Heart size={22} /></button>
        <button onClick={() => setProfileMenu(!profileMenu)}><UserRound size={22} /></button>
      </nav>
    </div>
  );
}

export default App;