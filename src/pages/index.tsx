import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import gql from "graphql-tag";
import "../App.css";
import {
  Button,
  TextField,
  makeStyles,
  Container,
  Box,
  Typography,
  Grid,
  IconButton,
  CircularProgress,
  Paper,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const MyStyle = makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    width:"100%"
  },

  formContainer: {
    background: "#f3f3f3",
    width: "100%",
    maxWidth: "600px",
    borderRadius: "5px",
    textAlign:"center"
  },
  contentWrapper: {
    width: "100%",
    maxWidth: "600px",
    marginTop: "20px",
  },
  Datalist: {
    background: "#f9f9f9",
    padding: "10px 20px",
    marginBottom: "4px",
  },
  loadingWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
    height: "100px",
  },
  buttoncenter:{
    textAlign:"center",
  },
  fontcolor:{
    color:"#fff"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
}));

const getBookmark = gql`
  {
    allBookmarks{
      id
      website
    }
  }
`;

const addbookmark = gql`
  mutation addBookmark($website: String!) {
    addBookmark(website: $website) {
      website
    }
  }
`;

const deletebookmark = gql`
  mutation deleteBookmark($id: ID!) {
    deleteBookmark(id: $id) {
      website
    }
  }
`;

export default function Home() {
  const classes = MyStyle();
  const [bookmark, setBookmark] = useState<string>("");

  const { loading, error, data } = useQuery(getBookmark);
  const [deleteBookmark] = useMutation(deletebookmark);
  const [addBookmark] = useMutation(addbookmark);

  if (error) {
    return <h2>Error</h2>;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    let regexp = ".com";
    if (bookmark.match(regexp)) {
      addBookmark({
        variables: {
          website: bookmark,
        },
        refetchQueries: [{ query: getBookmark }],
      });
      setBookmark("");
    }else{
      alert("Please Enter Valid URL");
    }
  };

  const handleDelete = (id) => {
    console.log(JSON.stringify(id));
    deleteBookmark({
      variables: {
        id: id,
      },
      refetchQueries: [{ query: getBookmark }],
    });
  };

  return (
    <Container>
      <div className={classes.mainContainer}>
        <Box py={8}>
          <Typography className={classes.fontcolor} variant="h5">Gatsby Bookmark App</Typography>
        </Box>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <div className={classes.mainContainer}>
              <Box py={1}>
                <Typography variant="h5">Enter Website to Bookmark</Typography>
              </Box>
            </div>
            <div className={classes.formContainer}>
              <Box p={6}>
                <form onSubmit={handleSubmit}>
                  <Box pb={2}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={bookmark}
                      onChange={(e) => setBookmark(e.target.value)}
                      label="Enter Website to Bookmark"
                      name="bookmark"
                      required
                    />
                  </Box>
                  <Button type="submit" variant="contained" color="primary">
                    Add to Bookmark
                  </Button>
                </form>
              </Box>
            </div>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <div className={classes.mainContainer}>
              <Box py={1}>
                <Typography variant="h5">List Of Bookmarks</Typography>
              </Box>
            </div>
            <div className={classes.contentWrapper}>
              <Box py={1}>
                  {loading ? (
                    <div className={classes.loadingWrapper}>
                      <CircularProgress />
                    </div>
                  ): (
                    data.allBookmarks.map((bookmark) => (
                      <div key={bookmark.id} className={classes.Datalist}>
                        <Grid container>
                          <Grid item xs={10} container alignItems="center">
                            <Typography>{bookmark.website}</Typography>
                          </Grid>
                          <Grid container justify="flex-end" item xs={2}>
                            <IconButton onClick={() => handleDelete(bookmark.id)}>
                              <CloseIcon color="secondary" fontSize="small" />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </div>
                    ))
                  )}
                </Box>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
