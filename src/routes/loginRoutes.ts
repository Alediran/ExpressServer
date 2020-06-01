import { Router, Request, Response, NextFunction } from 'express';

interface RequestWithBody extends Request {
  body: { [key: string]: string | undefined };
}

function requreAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.loggedIn) {
    next();
    return;
  }

  res.status(403);
  res.send('Not permitted');
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
  if (req.session && req.session.loggedIn) {
    res.send(`
    <div>
      <h1>You are logged in!</h1>
      <a href="/logout">Logout</a>
    </div>
    `);
  } else {
    res.send(`
    <div>
    <h1>You are not logged in!</h1>
    <a href="/login">Login</a>
    </div>
    `);
  }
});

router.get('/login', (req: RequestWithBody, res: Response) => {
  res.send(`
  <form method="POST">
    <div>
      <label>Email</label>
      <input name="email" />
    </div>
    <div>
      <label>Password</label>
      <input name="password" type="password" />
    </div>
    <button>Submit</button>
  </form>
  `);
});

router.post('/login', (req: RequestWithBody, res: Response) => {
  const { email, password } = req.body;

  if (email && password && email === 'asd@asd.com' && password === '1234') {
    req.session = { loggedIn: true };

    res.redirect('/');
  } else {
    res.send('Invaliud email or password');
  }
});

router.get('/logout', (req: Request, res: Response) => {
  req.session = undefined;
  res.redirect('/');
});

router.get('/protected', requreAuth, (req: Request, res: Response) => {
  res.send('Welcome to protected route, logged user');
});
export { router };
