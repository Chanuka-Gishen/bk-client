import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { CreateBookDialog } from '../component/createBookDialog';
import { fDate } from 'src/utils/format-time';
import EditIcon from '@mui/icons-material/Edit';

export const SalesBookView = ({
  isLoading,
  salesBooks,
  isOpenCreateDialog,
  isLoadingCreate,
  formik,
  handleOpenCloseCreateDialog,
  handleCreateSalesBook,
  selectedBook,
  handleSelectBook,
}) => {
  return (
    <>
      <Grid container columnSpacing={2} rowSpacing={4}>
        <Grid item xs={12} sm={12}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography variant="h4">Manage SalesBooks</Typography>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<AddIcon />}
              onClick={handleOpenCloseCreateDialog}
            >
              Add New Book
            </Button>
          </Stack>
        </Grid>
        {salesBooks.length > 0 && (
          <>
            {salesBooks.map((book, index) => (
              <Grid item xs={6} sm={2} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleSelectBook(book)}>
                    <CardContent>
                      <Typography align="center">{book.bookName}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </>
        )}
        {selectedBook && (
          <Grid item xs={12} sm={12}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ flexWrap: 'wrap' }}
                >
                  <Typography>{`Created on ${fDate(selectedBook.bookCreatedDate)}`}</Typography>
                  <Typography>{selectedBook.bookName}</Typography>
                  <Button variant="contained" startIcon={<EditIcon />}>
                    Edit
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
      {isOpenCreateDialog && (
        <CreateBookDialog
          open={isOpenCreateDialog}
          handleClose={handleOpenCloseCreateDialog}
          formik={formik}
          handleSubmit={handleCreateSalesBook}
          isLoading={isLoadingCreate}
        />
      )}
    </>
  );
};

SalesBookView.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  salesBooks: PropTypes.array,
  isOpenCreateDialog: PropTypes.bool.isRequired,
  isLoadingCreate: PropTypes.bool.isRequired,
  formik: PropTypes.object.isRequired,
  handleOpenCloseCreateDialog: PropTypes.func.isRequired,
  handleCreateSalesBook: PropTypes.func.isRequired,
  selectedBook: PropTypes.object,
  handleSelectBook: PropTypes.func.isRequired,
};
