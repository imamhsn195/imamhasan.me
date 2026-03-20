'use strict';

const GITHUB_USERNAME = 'imamhsn195';

const menuToggle = document.getElementById('menu-toggle');
const siteNav = document.getElementById('site-nav');
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const sections = Array.from(document.querySelectorAll('main section[id]'));
const revealItems = Array.from(document.querySelectorAll('[data-reveal]'));

const yearNode = document.getElementById('year');
const repoGrid = document.getElementById('repo-grid');
const statRepos = document.getElementById('gh-repos');
const statFollowers = document.getElementById('gh-followers');
const statFollowing = document.getElementById('gh-following');
const statAge = document.getElementById('gh-age');

if (yearNode) {
  yearNode.textContent = new Date().getFullYear().toString();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    if (siteNav && siteNav.classList.contains('open')) {
      siteNav.classList.remove('open');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute('id');
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    });
  },
  { rootMargin: '-40% 0px -45% 0px', threshold: 0.05 }
);

sections.forEach((section) => sectionObserver.observe(section));

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

function formatAccountAge(createdAt) {
  const created = new Date(createdAt);
  const now = new Date();
  let years = now.getFullYear() - created.getFullYear();
  let months = now.getMonth() - created.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  if (years <= 0) return `${months} mo`;
  return `${years} yr${years > 1 ? 's' : ''}`;
}

function toReadableNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function renderRepoItems(repos) {
  if (!repoGrid) return;

  if (!repos.length) {
    repoGrid.innerHTML = '<li class="glass-card repo-placeholder">No public repositories found.</li>';
    return;
  }

  repoGrid.innerHTML = repos
    .map((repo) => {
      const language = repo.language || 'Mixed';
      const stars = repo.stargazers_count || 0;
      const updatedAt = new Date(repo.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      return `
        <li class="glass-card repo-item">
          <h4><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h4>
          <p>${repo.description || 'No description provided for this repository yet.'}</p>
          <div class="repo-meta">
            <span>${language}</span>
            <span>★ ${toReadableNumber(stars)}</span>
            <span>Updated ${updatedAt}</span>
          </div>
        </li>
      `;
    })
    .join('');
}

async function loadGitHubData() {
  const profileUrl = `https://api.github.com/users/${GITHUB_USERNAME}`;
  const reposUrl = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`;

  try {
    const [profileResponse, reposResponse] = await Promise.all([fetch(profileUrl), fetch(reposUrl)]);

    if (!profileResponse.ok || !reposResponse.ok) {
      throw new Error('GitHub API request failed');
    }

    const profile = await profileResponse.json();
    const repos = await reposResponse.json();

    if (statRepos) statRepos.textContent = toReadableNumber(profile.public_repos || 0);
    if (statFollowers) statFollowers.textContent = toReadableNumber(profile.followers || 0);
    if (statFollowing) statFollowing.textContent = toReadableNumber(profile.following || 0);
    if (statAge) statAge.textContent = formatAccountAge(profile.created_at);

    renderRepoItems(Array.isArray(repos) ? repos : []);
  } catch (error) {
    if (repoGrid) {
      repoGrid.innerHTML =
        '<li class="glass-card repo-placeholder">Unable to load GitHub data right now. Please refresh or check connection.</li>';
    }
    if (statRepos) statRepos.textContent = 'N/A';
    if (statFollowers) statFollowers.textContent = 'N/A';
    if (statFollowing) statFollowing.textContent = 'N/A';
    if (statAge) statAge.textContent = 'N/A';
  }
}

loadGitHubData();