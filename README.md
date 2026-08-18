# syntax-tm.github.io

## Preview

<a href="https://syntax-tm.github.io">
  <p align="center">
    <img src="docs/preview.webp" alt="Preview" />
  </p>
</a>

## Features

- Responsive UI for desktop and mobile devices
- Supports keyboard, scrollwheel, swipe, or even a controller
- Swipe/touch input on mobile navigation
- Secret achievements[^1]
- Retro game console themes featuring boot animations, sound effects, fonts, and more
- WebGL rendered backgrounds

## Secrets

### Manual Unlock

<details>
  <summary>Click to see instructions...</summary>
  <p>
    In addition to each secret's unique unlocking requirements they can be unlocked (or locked) on-demand.
  </p>
  <h3>Instructions</h3>
  <ol>
    <li>
      Open the <i><b>secrets</b></i> page via one of the following:
      <ul>
        <li>
          XMB Menu
          <ol>
            <li>Select the <b>Home</b> category</li>
            <li>Open the <b>Secrets</b> item</li>
          </ol>
        </li>
        <li>
          Opening the <i><a href="https://syntax-tm.github.io/secrets">secrets</a></i> page directly
        </li>
      </ul>
    </li>
    <li>
      <b>Quickly</b> select (click or tap for desktop and mobile users respectively) the <b>Name</b> cell of any <b><i>secret</b></i> <b>5</b> or more times
    </li>
    <li>
      If done correctly, a snackbar notification should be dispalyed indicating whether the <b><i>secret</b></i> was locked or unlocked
    </li>
  </ol>
</details>

<!-- 1. 404
1. ANDROID
2. IWHBYD
3. KONAMI_CODE
4. MISSING_NO
5. OCEANGATE

<table>
  <tr>
    <th> </th>
    <th>Title</th>
    <th>Description</th>
    <th></th>
  </tr>
  <tr>
    <th align="right">1.</th>
    <td align="center">404</td>
    <td></td>
  </tr>
</table> -->

## Building

### Requirements

```sh
yarn dlx shadcn@latest init -t next
yarn shadcn@latest init
```

```sh
yarn next build
```

## Deployment

The site is deployed to [GitHub pages](https://syntax-tm.github.io/) using [GitHub Workflow](/.github/workflows/static.yml).

### Custom Domain

In order to use a domain it must first be configured in the repository settings. Then a `CNAME` file should be created in the root directory ([example](https://github.com/syntax-tm/syntax-tm.github.io/blob/main/CNAME)). You can read more about adding custom domains for GitHub Pages [here](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

[^1]: Each secret can be unlocked automatically for testing purposes
